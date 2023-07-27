import { Repository } from '@domains/shared/repository'
import { CreateMedicationDTO } from '../dto'
import { Medication } from '@prisma/client'
import { PrismaTransactionType } from '../types'

export class MedicationRepository extends Repository {
  async createMedication(data: CreateMedicationDTO): Promise<Medication> {
    return await this._prisma.medication.create({ data })
  }

  async createMedicationWithTx(
    data: CreateMedicationDTO,
    $tx: PrismaTransactionType
  ): Promise<Medication> {
    return await $tx.medication.create({ data })
  }
}
