import winston from 'winston'

const logConfiguration = {
  format: winston.format.combine(
    winston.format.label({ label: `Label🏷️` }),
    winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    winston.format.printf((info) => {
      return `Level: "${info.level}" Timestamp: "${info.timestamp}" Message: : "${
        info.message
      }", Metadata: ${JSON.stringify(info.metadata)}`
    })
  ),
  transports: [
    new winston.transports.Console({}),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
}
export const logger = winston.createLogger(logConfiguration)
