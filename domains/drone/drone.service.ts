import { Service } from '@domains/shared/Service'
import { DroneRepository } from './repositories/drone.repository'
import { MedicationRepository } from './repositories/medication.repository'
import { DroneMedicationRepository } from './repositories/droneMedication.repository'
import { Drone, DroneState } from '@prisma/client'
import { CreateDroneDTO, LoadMedicationDTO } from './dto'
import { ServiceResponse } from '@shared/service'
import { StatusCodes } from 'http-status-codes'
import { GetResourcesResponse, GetResourcesWithPaginationDTO } from '@domains/shared'

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

  async createDrone(data: CreateDroneDTO): Promise<ServiceResponse<Drone>> {
    try {
      const { serialNumber } = data

      const existingDrone = await this._droneRepository.getDroneBySerialNumber(serialNumber)
      if (existingDrone)
        return {
          success: false,
          statusCode: StatusCodes.CONFLICT,
          error: `Drone with serial number: ${serialNumber} already exists`
        }

      const drone = await this._droneRepository.createDrone(data)
      return {
        success: true,
        data: drone,
        statusCode: StatusCodes.CREATED
      }
    } catch (error) {
      return this.sendErrorServiceResponse(error)
    }
  }

  async getDroneById(id: number): Promise<ServiceResponse<Drone>> {
    try {
      const drone = await this._droneRepository.getDroneById(id)

      if (!drone)
        return {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          error: `Drone not found`
        }

      return {
        success: true,
        data: drone,
        statusCode: StatusCodes.OK
      }
    } catch (error) {
      return this.sendErrorServiceResponse(error)
    }
  }

  async getAvailableDrones(
    pagination: GetResourcesWithPaginationDTO
  ): Promise<ServiceResponse<GetResourcesResponse<Drone>>> {
    try {
      const drones = await this._droneRepository.getDronesByStatus([
        DroneState.IDLE,
        DroneState.LOADING
      ])

      return {
        success: true,
        data: drones,
        statusCode: StatusCodes.OK
      }
    } catch (error) {
      return this.sendErrorServiceResponse(error)
    }
  }

  async loadMedication(droneId: number, data: LoadMedicationDTO): Promise<ServiceResponse<Drone>> {
    try {
      await this._droneRepository.loadDrone(droneId, data)

      const loadedDrone = await this._droneRepository.getDroneWithMedicationsById(droneId)
      if (!loadedDrone)
        return {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          error: `Drone not found`
        }

      return {
        success: true,
        data: loadedDrone,
        statusCode: StatusCodes.OK
      }
    } catch (error) {
      return this.sendErrorServiceResponse(error)
    }
  }
}
