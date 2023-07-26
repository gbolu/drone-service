import dotenv from 'dotenv'
import { EnvConfig } from './types/env.type.js'
import { throwIfUndefined } from '../utilities/throwIfUndefined.js'

dotenv.config()

export const Config: EnvConfig = {
  SERVER: {
    NODE_ENVIRONMENT: throwIfUndefined('NODE_ENV', String(process.env.NODE_ENV)),
    PORT: throwIfUndefined('PORT', parseInt(String(process.env.PORT)))
  },
  DATABASE: {
    DATABASE_URL: throwIfUndefined('DATABASE_URL', String(process.env.DATABASE_URL))
  }
}
