import { createServer } from 'http'
import app from './app.js'
import { Config } from './config/env.config.js'
import { logger } from './utilities/logger.js'
import { initializePeriodicTasks } from './jobs/index.js'

const bootstrap = async () => {
  const server = createServer(app)

  initializePeriodicTasks()

  server.listen(Config.SERVER.PORT, async () => {
    logger.info(`Blusalt Drone API started on port ${Config.SERVER.PORT}...`)
  })

  process.on('uncaughtException', (error) => {
    logger.info(`Oops. Something happened on the server.`)
    logger.error(error)
    logger.info(`Shutting down gracefully...`)
    process.exit(1)
  })

  process.on('unhandledRejection', (error) => {
    logger.error(error)
  })
}

bootstrap()
