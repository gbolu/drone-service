export type NodeLevel = string

type ServerConfig = {
  PORT: string | number
  NODE_ENVIRONMENT: NodeLevel
}

type RedisConfig = {
  URL: string
}

type JWTConfig = {
  SECRET: string
  EXPIRY_TIME: string
}

type OTPConfig = {
  DEFAULT_EXPIRY: number
}

type EmailConfig = {
  MAILGUN?: {
    API_KEY: string
    DOMAIN: string
    MAIL_SENDER: string
  }
}

type PaymentConfig = {
  PAYSTACK?: {
    BASE_URL: string
    SECRET_KEY: string
  }
  FLUTTERWAVE?: {
    BASE_URL: string
    SECRET_KEY: string
  }
}

type SMSConfig = {
  PROVIDER?: {
    BASE_URL: string
    TOKEN: string
    SENDER: string
  }
}

type DatabaseConfig = {
  CLIENT: string
  HOST: string
  PORT: number
  USER: string
  NAME: string
  PASSWORD: string
}

type RisevestConfig = {
  BASE_URL?: string
  SECRET_KEY: string
  BEARER_KEY: string
}

type QoreIDConfig = {
  BASE_URL: string
  CLIENT_ID: string
  SECRET: string
}

export type EnvConfig = {
  SERVER: ServerConfig
  REDIS: RedisConfig
  JWT: JWTConfig
  OTP: OTPConfig
  DATABASE: DatabaseConfig
  EMAIL?: EmailConfig
  PAYMENT?: PaymentConfig
  SMS?: SMSConfig
  RISEVEST?: RisevestConfig
  QORE_ID?: QoreIDConfig
}
