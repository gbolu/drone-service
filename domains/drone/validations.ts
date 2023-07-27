import * as joi from 'joi'

import { DroneModel } from '@prisma/client'

export type CreateDroneDTO = {
  serialNumber: string
  model: DroneModel
  maxWeight: number
  battery: number
}

export const CreateDroneSchema = joi.object({
  serialNumber: joi.string().required().min(1).max(100),
  model: joi
    .string()
    .valid(...Object.values(DroneModel))
    .required(),
  maxWeight: joi.number().required().min(1).max(500),
  battery: joi.number().required().min(1).max(100)
})
