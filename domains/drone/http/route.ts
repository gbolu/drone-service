import { Router } from 'express'
import { DroneController } from './controller'
import { validateRequest } from '@domains/shared/http/middleware'
import { CreateDroneSchema } from '../validations'
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

export const DroneHTTPRoutes = router
