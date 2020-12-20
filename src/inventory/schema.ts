export type Client = 'web'|'mobile'
export type Lang = 'en-us'|'en-gb'|'de-de'|'es-es'

export interface ValidattionError {
  message: 'Validation failed';
  details: { [name: string]: unknown };
}

export interface Product {
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

export interface OrderItem {
  productId: string
  /**
   * @isInt
   */
  quantity: number
}

export interface Inventory {
  inventory: Product[],
  currency: string,
  $pagination: {
    remainingItems: number
  }
}
