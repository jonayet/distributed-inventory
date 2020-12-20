import { getInventory as getInventoryData } from './repositories/inventory'
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

export async function getInventory (count: number, page: number, client: string, lang: string): Promise<Inventory> {
  const products = await getInventoryData()
  const start = count * page
  const end = start + count
  const remaining = products.length - end
  const produceSegment = products.slice(start, end)

  const promises = produceSegment.map(async (p) => {
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
      remainingItems: remaining < 0 ? 0 : remaining
    }
  }
}
