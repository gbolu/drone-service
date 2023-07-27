import { AppError } from '@utilities/appError.js'
import { StatusCodes } from 'http-status-codes'
import { logger } from '@utilities/logger.js'
import { ERROR_MESSAGES } from '../errors/responseMessages.js'
import { ServiceResponse } from '@shared/service/types.js'
import { Response } from 'express'
import { ErrorCodes } from '@shared/errors/errorCodes.js'
import { errorResponse, successResponse, successResponseWithCount } from './responseHandlers.js'
import { GetResourcesResponse } from '@domains/shared/types.js'

export class Controller {
  protected sendErrorResponse = errorResponse
  protected sendSuccessResponse = successResponse
  protected sendSuccessResponseWithCount = successResponseWithCount
  protected logger = logger
  protected name: string

  constructor(serviceName: string) {
    this.name = serviceName
  }

  protected logInfo(message: string) {
    this.logger.info(message, { source: this.name })
  }

  protected logError(error: unknown) {
    this.logger.error(error)
  }

  protected createAppError({
    message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    errorCode = ErrorCodes.INTERNAL_SERVER_ERROR
  }: {
    message?: string
    statusCode?: number
    errorCode?: string
  }) {
    return new AppError(message, statusCode, errorCode)
  }

  protected sendServiceErrorResponse(
    serviceResponse: ServiceResponse<any | void>,
    response: Response
  ) {
    const { error, statusCode } = serviceResponse

    if (statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
      this.logError(error)
      return this.sendErrorResponse(this.createAppError({}), response)
    }

    return this.sendErrorResponse(new AppError(error, statusCode), response)
  }

  protected sendServiceResourceSuccessResponse(
    serviceResponse: ServiceResponse<GetResourcesResponse<any>>,
    message: string,
    response: Response
  ) {
    const { resources, count } = serviceResponse.data!

    return this.sendSuccessResponseWithCount(resources, message, StatusCodes.OK, response, count)
  }
}
