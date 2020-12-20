import { CacheStore } from '@platform/cache/cache-store'
import { tryLock, releaseLock } from '@platform/distributed-lock/lock-manager'
import { log } from '@platform/logging/logger'
import { getInventory as getInventoryTable } from '@platform/persistence/inventory-db'
import { waitUntil } from './utils'

const cache = new CacheStore()
const inventoryKey = 'inventory-key'

type InventoryRepo = ReturnType<typeof getInventoryTable>
export async function getInventory (): InventoryRepo {
  // TODO: add cache layer
  // if (await cache.has(inventoryKey)) {
  //   return cache.get(inventoryKey)
  // }

  let lockRef
  try {
    lockRef = await tryLock(inventoryKey)
    if (!lockRef) {
      await waitUntil(async () => !await cache.has(inventoryKey))
    }

    const inventory = await getInventoryTable()
    await cache.set(inventoryKey, inventory)
    return inventory
  } catch (err) {
    log('error', err)
    throw new Error('Unable to reach inventory DB')
  } finally {
    if (lockRef) releaseLock(inventoryKey, lockRef)
  }
}
