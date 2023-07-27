import { Repository } from '@domains/shared/repository'
import { DroneLog } from '@prisma/client'
import { CreateDroneLogDTO } from '../dto'

export class DroneLogRepository extends Repository {
  constructor() {
    super()
  }

  async createDroneLog(data: CreateDroneLogDTO): Promise<DroneLog> {
    return await this._prisma.droneLog.create({ data })
  }
}
