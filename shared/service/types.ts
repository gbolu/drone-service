export type ServiceResponse<T> = {
  success: boolean
  error?: string
  data?: T
  statusCode: number
}
