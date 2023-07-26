import { Service } from '@domains/shared/Service'
import { DroneRepository } from './repositories/drone.repository'
import { MedicationRepository } from './repositories/medication.repository'
import { DroneMedicationRepository } from './repositories/droneMedication.repository'

export class DroneService extends Service {
  private readonly _droneRepository: DroneRepository
  private readonly _medicationRepository: MedicationRepository
  private readonly _droneMedicationRepository: DroneMedicationRepository

  constructor() {
    super()
    this._droneRepository = new DroneRepository()
    this._medicationRepository = new MedicationRepository()
    this._droneMedicationRepository = new DroneMedicationRepository()
  }
}
