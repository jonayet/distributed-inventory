import { UInt32 } from './schema'

export class InternalServerError extends Error {
  public status = 500
  constructor (message: string) {
    super(message)
    this.name = 'InternalServerError'
  }
}

export class BadRequest extends Error {
  public status = 400
  constructor (message: string) {
    super(message)
    this.name = 'BadRequest'
  }
}

export class AuthorizationError {
  public name: string
  public status: UInt32
  public message: string
  constructor (message: string) {
    this.name = 'AuthorizationError'
    this.status = 401
    this.message = message
  }
}

export class InvalidOrderError extends Error {
  public status = 400
  public invalidItems

  constructor (message: string, invalidItems: string[]) {
    super(message)
    this.name = 'InvalidOrderError'
    this.invalidItems = invalidItems
  }
}

export interface ValidattionError {
  message: 'Validation failed'
  details: { [name: string]: unknown }
}
