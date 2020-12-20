import axios from 'axios'
import { CacheStore } from '@platform/cache/cache-store'
import { tryLock, releaseLock } from '@platform/distributed-lock/lock-manager'
import { log } from '@platform/logging/logger'
import { priceServiceHost } from '../config'
import { waitUntil } from './utils'

const cache = new CacheStore()

interface ProductPrice {
  price: number
  currency: string
}

export async function getPrice (productId: string, lang: string): Promise<ProductPrice> {
  const productKey = `${productId}-${lang}`
  if (await cache.has(productKey)) {
    return cache.get(productKey)
  }

  let lockRef
  try {
    lockRef = await tryLock(productKey)
    if (!lockRef) {
      await waitUntil(async () => !await cache.has(productKey))
    }

    const { data } = await axios.get(`${priceServiceHost}/product/${productId}`, {
      headers: {
        accept: 'application/json',
        'accept-language': lang
      }
    })
    await cache.set(productKey, data)
    return data
  } catch (err) {
    log(err, 'error')
    throw new Error('Unable to reach price service')
  } finally {
    if (lockRef) releaseLock(productKey, lockRef)
  }
}
