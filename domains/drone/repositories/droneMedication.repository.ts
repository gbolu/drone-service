import { Repository } from '@domains/shared/repository'
import { DroneMedication, PrismaClient } from '@prisma/client'
import { CreateDroneMedicationDTO } from '../dto'
import { PrismaTransactionType } from '../types'

export class DroneMedicationRepository extends Repository {
  constructor() {
    super()
  }

  async createDroneMedication(data: CreateDroneMedicationDTO): Promise<DroneMedication> {
    return await this._prisma.droneMedication.create({ data })
  }

  async createDroneMedicationWithTx(data: CreateDroneMedicationDTO, $tx: PrismaTransactionType) {
    return await $tx.droneMedication.create({ data })
  }

  async getDroneLoadWeight(droneId: number): Promise<number> {
    const droneMedications = await this._prisma.droneMedication.aggregate({
      where: {
        droneId
      },
      _max: {
        weight: true
      }
    })

    return droneMedications._max.weight || 0
  }

  async getDroneLoadWeightWithTx(droneId: number, $tx: PrismaTransactionType): Promise<number> {
    const droneMedications = await $tx.droneMedication.aggregate({
      where: {
        droneId
      },
      _max: {
        weight: true
      }
    })

    return droneMedications._max.weight || 0
  }
}
