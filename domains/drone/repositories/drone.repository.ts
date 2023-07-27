import { Drone, DroneState, Medication, PrismaClient } from '@prisma/client'
import { CreateDroneDTO, UpdateDroneDTO } from '../dto'
import { GetResourcesResponse, GetResourcesWithPaginationDTO } from '@domains/shared'
import { Repository } from '@domains/shared/repository'
import { AppError } from '@utilities/appError'
import { StatusCodes } from 'http-status-codes'
import { DroneMedicationRepository } from './droneMedication.repository'
import { MedicationRepository } from './medication.repository'
import { PrismaTransactionType } from '../types'

export class DroneRepository extends Repository {
  private readonly _droneMedicationRepository: DroneMedicationRepository
  private readonly _medicationRepository: MedicationRepository

  constructor() {
    super()
    this._droneMedicationRepository = new DroneMedicationRepository()
    this._medicationRepository = new MedicationRepository()
  }

  async createDrone(data: CreateDroneDTO): Promise<Drone> {
    return await this._prisma.drone.create({ data })
  }

  async updateDrone(droneId: number, data: Partial<UpdateDroneDTO>): Promise<Drone> {
    return await this._prisma.drone.update({
      where: {
        id: droneId
      },
      data
    })
  }

  async getDroneBySerialNumber(serialNumber: string): Promise<Drone | null> {
    return await this._prisma.drone.findUnique({ where: { serialNumber } })
  }

  async getDroneById(id: number): Promise<Drone | null> {
    return await this._prisma.drone.findUnique({ where: { id } })
  }

  async getDroneByIdWithTx(id: number, $tx: PrismaTransactionType): Promise<Drone | null> {
    return await $tx.drone.findUnique({ where: { id } })
  }

  async getDroneWithMedicationsById(id: number): Promise<Drone | null> {
    return await this._prisma.drone.findUnique({
      where: { id },
      include: { DroneMedication: true }
    })
  }

  async getDroneWithMedicationsByIdWithTx(
    id: number,
    $tx: PrismaTransactionType
  ): Promise<Drone | null> {
    return await $tx.drone.findUnique({
      where: { id },
      include: { DroneMedication: true }
    })
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

  async loadDrone(droneId: number, data: any) {
    await this._prisma.$transaction(async ($tx) => {
      const drone = await this.getDroneByIdWithTx(droneId, $tx)

      if (!drone) throw new AppError(`Drone with id: ${droneId} not found`, StatusCodes.NOT_FOUND)

      if (!this.isDroneAvailable(drone)) {
        throw new AppError(
          `Drone with id: ${droneId} is not available for loading`,
          StatusCodes.CONFLICT
        )
      }

      if (drone.battery < 25) {
        throw new AppError(
          `Drone with id: ${droneId} has low battery and cannot be loaded`,
          StatusCodes.CONFLICT
        )
      }

      const droneLoadWeight = await this._droneMedicationRepository.getDroneLoadWeightWithTx(
        droneId,
        $tx
      )

      if (droneLoadWeight + data.medication.weight > drone.maxWeight) {
        throw new AppError(
          `Medication load weight will exceed drone max weight`,
          StatusCodes.CONFLICT
        )
      }

      const medication = await this._medicationRepository.createMedicationWithTx(
        data.medication,
        $tx
      )

      if (!medication)
        throw new AppError(`Medication could not be created`, StatusCodes.INTERNAL_SERVER_ERROR)

      await this._droneMedicationRepository.createDroneMedicationWithTx(
        {
          droneId,
          medicationId: medication.id,
          weight: data.medication.weight
        },
        $tx
      )

      if (drone.state === DroneState.IDLE) {
        await $tx.drone.update({
          where: { id: droneId },
          data: { state: DroneState.LOADING }
        })
      }

      if (drone.maxWeight === droneLoadWeight + data.medication.weight) {
        await $tx.drone.update({
          where: { id: droneId },
          data: { state: DroneState.LOADED }
        })
      }
    })
  }

  async getFirstDrone(): Promise<Drone | null> {
    return await this._prisma.drone.findFirst({
      orderBy: {
        id: 'asc'
      }
    })
  }

  async getDronesWithCursor(cursor: number = 1, limit: number = 1): Promise<Drone[]> {
    const drones = await this._prisma.drone.findMany({
      take: limit,
      skip: 1,
      cursor: {
        id: cursor
      }
    })

    return drones
  }

  private isDroneAvailable(drone: Drone): boolean {
    return drone.state === DroneState.IDLE || drone.state === DroneState.LOADING
  }
}
