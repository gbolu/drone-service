import { AppError } from '../../utilities/appError.js'
import { Request, Response, NextFunction } from 'express'
import { Config } from '../../config/env.config.js'
import { NODE_LEVELS } from '../../config/types/_enums.js'
import { debugResponse, errorResponse } from '@shared/http/index.js'

export async function globalErrorHandlerMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  err.statusCode = err.statusCode || 500
  err.status = err.status || false

  if (Config.SERVER.NODE_ENVIRONMENT === NODE_LEVELS.Production) {
    return errorResponse(err, res)
  }

  return debugResponse(err, res)
}
