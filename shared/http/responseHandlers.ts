import { AppError } from '@utilities/appError.js'
import { Response } from 'express'

export function debugResponse(error: AppError, res: Response) {
  return res.status(error.statusCode).json({
    status: error.status,
    errorCode: error.errorCode,
    message: error.message,
    error,
    stack: error.stack
  })
}

export function errorResponse(err: AppError, res: Response) {
  return res.status(err.statusCode).json({
    status: false,
    statusCode: err.statusCode,
    errorCode: err.errorCode,
    message: err.message
  })
}

export function parsedErrorResponse(error: unknown, res: Response) {
  const err = error as AppError
  return res.status(err.statusCode).json({
    status: false,
    statusCode: err.statusCode,
    errorCode: err.errorCode,
    message: err.message
  })
}

export default function sendProductionErrors(err: AppError, res: Response) {
  return errorResponse(err, res)
}

export function successResponse(data: unknown, message: string, statusCode: number, res: Response) {
  return res.status(statusCode).json({
    status: true,
    statusCode: res.statusCode,
    message,
    data
  })
}

export function successResponseWithCount(
  data: unknown,
  message: string,
  statusCode: number,
  res: Response,
  count: number
) {
  return res.status(statusCode).json({
    status: true,
    statusCode: res.statusCode,
    message,
    data,
    count
  })
}
