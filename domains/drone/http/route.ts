import { Router } from 'express'
import { DroneController } from './controller'
import { validateRequest } from '@domains/shared/http/middleware'
import { CreateDroneSchema, LoadMedicationSchema } from '../dto'
import { VALIDATION_TYPE } from '@domains/shared/http/validations'
import { IdFetchSchema, ResourceFetchSchema } from '@domains/shared/http/validations/shared'

const router = Router()
const droneController = new DroneController()

router.post(
  '/',
  validateRequest(CreateDroneSchema, VALIDATION_TYPE.BODY),
  droneController.createDrone
)

router.get(
  '/available',
  validateRequest(ResourceFetchSchema, VALIDATION_TYPE.QUERY),
  droneController.getAvailableDrones
)

router.get(
  '/:id',
  validateRequest(IdFetchSchema, VALIDATION_TYPE.PARAMS),
  droneController.getDroneById
)

router.post(
  '/:id/medication',
  validateRequest(IdFetchSchema, VALIDATION_TYPE.PARAMS),
  validateRequest(LoadMedicationSchema, VALIDATION_TYPE.BODY),
  droneController.loadMedication
)

export const DroneHTTPRoutes = router
