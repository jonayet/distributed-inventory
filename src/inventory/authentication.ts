import { Request } from 'express'
import { AuthorizationError } from './errors'

export function expressAuthentication (req: Request, securityName: string, scopes?: string[]): Promise<string> {
  if (securityName === 'api_key' && req.query?.access_token) {
    return Promise.resolve(req.query?.access_token as string)
  }

  return Promise.reject(new AuthorizationError('Unauthorized'))
}
