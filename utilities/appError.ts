export class AppError extends Error {
  errorCode?: string
  status: boolean
  statusCode: number

  constructor(message: string | undefined, statusCode: number, errorCode?: string) {
    super(message)

    this.errorCode = errorCode
    this.status = false
    this.statusCode = statusCode

    Error.captureStackTrace(this, this.constructor)
  }
}
