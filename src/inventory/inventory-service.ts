import { getInventory as getInventoryTable } from '@platform/persistence/inventory-db'
import { getPrice } from './repositories/price'

interface Product {
  productId: string,
  /**
   * @isInt
   */
  available: number,
  /**
   * @isInt
   */
  price: number
}

export interface Inventory {
  inventory: Product[],
  currency: string,
  $pagination: {
    remainingItems: number
  }
}

const currencyMap: Record<string, string> = {
  'en-us': '$',
  'en-gb': '£',
  'de-de': '€',
  'es-es': '€'
}

export async function getInventory (lang: string): Promise<Inventory> {
  const products = await getInventoryTable()
  const promises = products.map(async (p) => {
    const { price } = await getPrice(p.productId, lang)
    return {
      productId: p.productId,
      available: p.actualQuantity,
      price
    }
  })

  return {
    inventory: await Promise.all(promises),
    currency: currencyMap[lang],
    $pagination: {
      remainingItems: 0
    }
  }
}
