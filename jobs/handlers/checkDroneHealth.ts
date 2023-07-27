import { DroneRepository } from '@domains/drone/repositories/drone.repository'
import { DroneLogRepository } from '@domains/drone/repositories/droneLogs.repository'

export const checkDroneHealth = async () => {
  const timePeriod = new Date().toISOString()
  console.log(`Checking drone health for time period: ${timePeriod}...`)

  let drone = await new DroneRepository().getFirstDrone()
  if (!drone) {
    console.log('No drones found')
    return
  }

  while (true) {
    console.log(`Checking drone ${drone.id}...`)

    await new DroneLogRepository().createDroneLog({
      droneId: drone.id,
      battery: drone.battery,
      state: drone.state
    })

    const fetchedDrones = await new DroneRepository().getDronesWithCursor(drone.id)
    if (fetchedDrones.length === 0) {
      break
    }

    drone = fetchedDrones[0]
  }

  console.log(`Finished checking drone health for time period: ${timePeriod}...`)
}
