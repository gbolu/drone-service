import * as joi from 'joi'

import { DroneModel, DroneState } from '@prisma/client'
import { type } from 'os'

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

export type UpdateDroneDTO = {
  serialNumber?: string
  model?: DroneModel
  maxWeight?: number
  battery?: number
  state?: DroneState
}

export const UpdateDroneSchema = joi.object({
  serialNumber: joi.string().min(1).max(100),
  model: joi.string().valid(...Object.values(DroneModel)),
  maxWeight: joi.number().min(1).max(500),
  battery: joi.number().min(1).max(100),
  state: joi.string().valid(...Object.values(DroneState))
})

export const CreateMedicationSchema = joi.object({
  name: joi
    .string()
    .required()
    .min(1)
    .regex(/^[a-zA-Z0-9_-]+$/),
  description: joi.string(),
  weight: joi.number().required().min(0.1),
  code: joi
    .string()
    .required()
    .min(1)
    .regex(/^[A-Z0-9_]+$/),
  image: joi.string().uri()
})

export type CreateMedicationDTO = {
  name: string
  description?: string
  weight: number
  code: string
  image?: string
}

export const LoadMedicationSchema = joi.object({
  medication: CreateMedicationSchema.required()
})

export type LoadMedicationDTO = {
  droneId: number
  medication: CreateMedicationDTO
}

export type CreateDroneMedicationDTO = {
  droneId: number
  medicationId: number
  weight: number
}
