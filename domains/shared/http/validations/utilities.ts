import { AppError } from '@utilities/appError.js'
export type CallBack = (err: Error | null, result?: unknown) => void

export const VALIDATION_TYPE = {
  QUERY: 'QUERY',
  BODY: 'BODY',
  PARAMS: 'PARAMS'
} as const

type ObjectValues<T> = T[keyof T]
export type ValidationType = ObjectValues<typeof VALIDATION_TYPE>

export type ValidationResult = {
  error?: null | AppError
}
