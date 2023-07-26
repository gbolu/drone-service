import { Request, Response, NextFunction } from 'express'
import Joi, { ValidationError } from 'joi'

import { AppError } from '@utilities/appError.js'
import { VALIDATION_TYPE, ValidationType } from '@http/validations/utilities.js'
import { ErrorCodes } from '@shared/errors/errorCodes.js'
import { errorResponse } from '@shared/http/index.js'

export const validateRequest =
  (schema: Joi.AnySchema, validationType: ValidationType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    let valueSource: any
    try {
      switch (validationType) {
        case VALIDATION_TYPE.BODY:
          valueSource = req.body
          break

        case VALIDATION_TYPE.QUERY:
          valueSource = req.query
          break

        case VALIDATION_TYPE.PARAMS:
          valueSource = req.params
          break
      }
      await schema.validateAsync(valueSource)

      return next()
    } catch (error) {
      const { message } = error as ValidationError

      return errorResponse(new AppError(message, 400, ErrorCodes.VALIDATION_ERROR), res)
    }
  }
