import { NextFunction, Request, Response } from 'express'
import { DroneService } from '..'
import { Controller } from '@shared/http'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '@utilities/catchAsync'
import { GetResourcesWithPaginationDTO } from '@domains/shared'

export class DroneController extends Controller {
  private _droneService: DroneService

  constructor() {
    super('DroneController')
    this._droneService = new DroneService()
  }

  createDrone = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const droneResponse = await this._droneService.createDrone(req.body)

      if (!droneResponse.success) {
        return this.sendServiceErrorResponse(droneResponse, res)
      }

      const { data: drone } = droneResponse

      return this.sendSuccessResponse(drone, `Drone created successfully`, StatusCodes.CREATED, res)
    }
  )

  getAvailableDrones = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const dronesResponse = await this._droneService.getAvailableDrones(
        req.query as unknown as GetResourcesWithPaginationDTO
      )

      if (!dronesResponse.success) {
        return this.sendServiceErrorResponse(dronesResponse, res)
      }

      const { data: drones } = dronesResponse

      return this.sendSuccessResponseWithCount(
        drones!.resources,
        `Available drones retrieved successfully`,
        StatusCodes.OK,
        res,
        drones!.count
      )
    }
  )

  getDroneById = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const droneResponse = await this._droneService.getDroneById(Number(req.params.id))

      if (!droneResponse.success) {
        return this.sendServiceErrorResponse(droneResponse, res)
      }

      const { data: drone } = droneResponse

      return this.sendSuccessResponse(drone, `Drone retrieved successfully`, StatusCodes.OK, res)
    }
  )

  updateDrone = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const droneResponse = await this._droneService.updateDrone(Number(req.params.id), req.body)

      if (!droneResponse.success) {
        return this.sendServiceErrorResponse(droneResponse, res)
      }

      const { data: drone } = droneResponse

      return this.sendSuccessResponse(drone, `Drone updated successfully`, StatusCodes.OK, res)
    }
  )

  loadMedication = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const droneMedicationResponse = await this._droneService.loadMedication(
        Number(req.params.id),
        req.body
      )

      if (!droneMedicationResponse.success) {
        return this.sendServiceErrorResponse(droneMedicationResponse, res)
      }

      const { data: drone } = droneMedicationResponse

      return this.sendSuccessResponse(
        drone,
        `Drone medication loaded successfully`,
        StatusCodes.CREATED,
        res
      )
    }
  )
}
