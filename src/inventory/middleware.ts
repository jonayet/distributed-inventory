import logger from '@platform/logging/logger'
import { Request, Response, NextFunction } from 'express'
import { ValidateError } from 'tsoa'
import { AuthorizationError } from './authentication'

export function notFoundHandler (_: Request, res: Response) {
  res.status(404).send({
    message: 'Not Found'
  })
}

export function errorHandler (err: any, req: Request, res: Response, next: NextFunction): Response | void {
  if (err instanceof ValidateError) {
    logger.log('error', `Caught Validation Error on ${req.path}:`, err.fields)
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields
    })
  }

  if (err instanceof AuthorizationError) {
    logger.log('log', `Caught Authorization Error on ${req.path}`)
    return res.status(err.status).json({
      message: err.message
    })
  }

  logger.log('error', `Caught Unknown Error on ${req.path}`)
  const { status = 500 } = err as any
  res.status(status).json({
    message: err.message
  })
}
