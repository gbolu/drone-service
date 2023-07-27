import { schedule } from 'node-cron'
import { checkDroneHealth } from './handlers/checkDroneHealth'

export const initializePeriodicTasks = () => {
  schedule('*/10 * * * *', checkDroneHealth, {
    timezone: 'Africa/Lagos'
  })
}
