import { ServiceResponse } from '@shared/service/types.js'
import { AppError } from '@utilities/appError.js'
import { StatusCodes } from 'http-status-codes'

export class Service {
  protected sendErrorServiceResponse = (error: unknown): ServiceResponse<any> => {
    return {
      success: false,
      statusCode: (error as AppError)?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      error: (error as AppError).message
    }
  }
}
