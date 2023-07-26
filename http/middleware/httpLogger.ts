import morgan from 'morgan'

import { NODE_LEVELS } from '@config/types/_enums.js'
import { Config } from '@config/env.config.js'

export const httpLoggerMiddleware = morgan(
  Config.SERVER.NODE_ENVIRONMENT === NODE_LEVELS.Development ? 'dev' : 'tiny'
)
