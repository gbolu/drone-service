export type NodeLevel = string

type ServerConfig = {
  PORT: string | number
  NODE_ENVIRONMENT: NodeLevel
}

type DatabaseConfig = {
  DATABASE_URL: string
}

export type EnvConfig = {
  SERVER: ServerConfig
  DATABASE: DatabaseConfig
}
