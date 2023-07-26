import dotenv from 'dotenv'
import { EnvConfig } from './types/env.type.js'
import { throwIfUndefined } from '../utilities/throwIfUndefined.js'

dotenv.config()

export const Config: EnvConfig = {
  SERVER: {
    NODE_ENVIRONMENT: throwIfUndefined('NODE_ENV', String(process.env.NODE_ENV)),
    PORT: throwIfUndefined('PORT', parseInt(String(process.env.PORT)))
  },
  REDIS: {
    URL: throwIfUndefined('REDIS_URL', String(process.env.REDIS_URL))
  },
  JWT: {
    SECRET: throwIfUndefined('JWT_SECRET', String(process.env.JWT_SECRET)),
    EXPIRY_TIME: throwIfUndefined('JWT_EXPIRY_TIME', String(process.env.JWT_EXPIRY_TIME))
  },
  OTP: {
    DEFAULT_EXPIRY: throwIfUndefined(
      'OTP_DEFAULT_EXPIRY',
      parseInt(String(process.env.OTP_DEFAULT_EXPIRY))
    )
  },
  DATABASE: {
    CLIENT: throwIfUndefined('DATABASE_CLIENT', String(process.env.DATABASE_CLIENT)),
    HOST: throwIfUndefined('DATABASE_HOST', String(process.env.DATABASE_HOST)),
    NAME: throwIfUndefined('DATABASE_NAME', String(process.env.DATABASE_NAME)),
    PASSWORD: throwIfUndefined('DATABASE_PASSWORD', String(process.env.DATABASE_PASSWORD)),
    PORT: throwIfUndefined('DATABASE_PORT', parseInt(String(process.env.DATABASE_PORT))),
    USER: throwIfUndefined('DATABASE_USER', String(process.env.DATABASE_USER))
  },
  EMAIL: {
    MAILGUN: {
      API_KEY: throwIfUndefined('MAILGUN_API_KEY', String(process.env.MAILGUN_API_KEY)),
      DOMAIN: throwIfUndefined('MAILGUN_DOMAIN', String(process.env.MAILGUN_DOMAIN)),
      MAIL_SENDER: throwIfUndefined('MAILGUN_SENDER', String(process.env.MAILGUN_SENDER))
    }
  },
  PAYMENT: {
    PAYSTACK: {
      BASE_URL: throwIfUndefined(
        'PAYSTACK_BASE_URL',
        String(process.env.PAYSTACK_BASE_URL) || `https://api.paystack.co`
      ),
      SECRET_KEY: throwIfUndefined('PAYSTACK_SECRET_KEY', String(process.env.PAYSTACK_SECRET_KEY))
    },
    FLUTTERWAVE: {
      BASE_URL: throwIfUndefined(
        'FLUTTERWAVE_BASE_URL',
        String(process.env.FLUTTERWAVE_BASE_URL) || 'https://api.flutterwave.com'
      ),
      SECRET_KEY: throwIfUndefined(
        'FLUTTERWAVE_SECRET_KEY',
        String(process.env.FLUTTERWAVE_SECRET_KEY)
      )
    }
  },
  RISEVEST: {
    SECRET_KEY: throwIfUndefined('RISEVEST_SECRET_KEY', String(process.env.RISEVEST_SECRET_KEY)),
    BASE_URL: process.env.RISEVEST_BASE_URL || 'https://nyx.risevest.co/api',
    BEARER_KEY: throwIfUndefined('RISEVEST_BEARER_KEY', String(process.env.RISEVEST_BEARER_KEY))
  },
  QORE_ID: {
    BASE_URL: process.env.QOREID_BASE_URL || 'https://api.qoreid.com',
    CLIENT_ID: throwIfUndefined('QOREID_CLIENT_ID', String(process.env.QOREID_CLIENT_ID)),
    SECRET: throwIfUndefined('QOREID_SECRET', String(process.env.QOREID_SECRET))
  }
}
