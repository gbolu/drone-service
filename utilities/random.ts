import lodash from 'lodash'
import { generate } from 'randomstring'

const { random } = lodash

export const generateRandomNumber = (min: number, max: number): number => {
  return random(min, max, false)
}

export const generateRandomString = (length: number): string => {
  return generate({
    length,
    charset: 'alphanumeric'
  })
}

export const generateRandomOTP = (): number => {
  return generateRandomNumber(100000, 999999)
}
