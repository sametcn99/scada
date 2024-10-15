import type { NextFunction, Request, Response } from 'express'
import { logAppEvents } from '../utils/logger'

/**
 * Middleware function for logging HTTP requests and responses.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 */
export const expressLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const method = req.method
  const url = req.url
  const userAgent = req.headers['user-agent']
  const start = Date.now()

  // Listen for the response to finish
  res.on('finish', () => {
    const duration = Date.now() - start
    logAppEvents('Message', `${method} ${url} - ${userAgent} - ${duration}ms`)
  })

  // Call the next middleware function in the stack
  next()
}
