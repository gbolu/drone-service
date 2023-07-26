import express, { NextFunction, Request, Response, Router } from 'express'
import cors from 'cors'

import { AppError } from '@utilities/index.js'
import { globalErrorHandlerMiddleware, httpLoggerMiddleware } from '@http/middleware/index.js'
import { ErrorCodes } from '@shared/errors/errorCodes.js'

const app = express()

app.use(httpLoggerMiddleware)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const apiRouter = Router()

app.use('/api', apiRouter)

app.get('/', (req, res) => {
  return res.status(200).json({
    status: true,
    message: 'welcome here, proudly 🇳🇬'
  })
})

// HANDLING UNHANDLED ROUTES
app.all('*', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this Server!`, 404, ErrorCodes.INVALID_ROUTE)
  )
})

app.use(globalErrorHandlerMiddleware)

export default app
