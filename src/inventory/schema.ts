/**
 * @default web
 */
export type Client = 'web'|'mobile'

/**
 * @default en-us
 */
export type Lang = 'en-us'|'en-gb'|'de-de'|'es-es'

/**
 * @minLength 2 minimum length is 2
 */
export type UUID = string

/**
 * Unsigned Integer
 * @isInt please provide a unsigned integer value
 * @minimum 0 value must be greater that or equal to 0
 * @default 0
 */
export type UInt32 = number

/**
 * Unsigned Decimal
 * @isFloat please provide a floationg point value
 * @minimum 0 value must be greater that or equal to 0
 * @default 0
 */
export type UFloat32 = number

/**
 * DateTime
 * @isDateTime
 */
export type DateTime = string

export interface Product {
  productId: string
  available: UInt32
  price: UFloat32
}

export interface OrderItem {
  productId: string
  quantity: UInt32
}

export interface Inventory {
  inventory: Product[],
  currency: string,
  $pagination: {
    remainingItems: UInt32
  }
}

export class ConfirmationLinks {
  public confirm: string
  public cancel: string
  public status: string
  public validTill: string

  constructor (orderId: string, validTill: string) {
    this.confirm = `/confirm/${orderId}`
    this.cancel = `/cancel/${orderId}`
    this.status = `/status/${orderId}`
    this.validTill = validTill
  }
}

export interface PendingOrderResponse {
  availableItems: OrderItem[]
  unavailableItems: OrderItem[]
  confirmation: ConfirmationLinks
}

export interface PendingOrderStatus {
  items: OrderItem[]
  confirmation: ConfirmationLinks
}

export interface PendingOrder {
  orderId: UUID
  validTill: DateTime
}
