export function throwIfUndefined<T>(configName: string, value: T): T {
  if (!value) {
    throw new Error(`${configName} cannot be undefined. Please provide a value for it.`)
  }

  if (typeof value === 'string' && value.length === 0) {
    throw new Error(`${configName} cannot be undefined. Please provide a value for it.`)
  }

  return value
}
