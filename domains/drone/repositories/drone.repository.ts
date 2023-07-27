import { Drone, DroneState, PrismaClient } from '@prisma/client'
import { CreateDroneDTO } from '../validations'
import { GetResourcesResponse, GetResourcesWithPaginationDTO } from '@domains/shared'

export class DroneRepository {
  private readonly _prisma: PrismaClient

  constructor() {
    this._prisma = new PrismaClient()
  }

  async createDrone(data: CreateDroneDTO): Promise<Drone> {
    return await this._prisma.drone.create({ data })
  }

  async getDroneBySerialNumber(serialNumber: string): Promise<Drone | null> {
    return await this._prisma.drone.findUnique({ where: { serialNumber } })
  }

  async getDroneById(id: number): Promise<Drone | null> {
    return await this._prisma.drone.findUnique({ where: { id } })
  }

  async getDronesByStatus(
    states: DroneState[],
    pagination?: GetResourcesWithPaginationDTO
  ): Promise<GetResourcesResponse<Drone>> {
    const page = pagination?.page || 0
    const limit = pagination?.limit || 10

    const drones = await this._prisma.drone.findMany({
      where: { state: { in: states } },
      skip: page * limit,
      take: limit
    })

    const count = await this._prisma.drone.count({
      where: { state: { in: states } }
    })

    return {
      resources: drones,
      count
    }
  }
}
