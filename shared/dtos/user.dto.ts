export type CreateUserWithEmailDTO = {
  lastName: string
  firstName: string
  email: string
  password: string
  referrer_code?: string
}

export type CreateUserWithPhoneDTO = {
  lastName: string
  firstName: string
  referrer_code?: string
  phoneNumber: string
}

export type CreateUserDTO = CreateUserWithEmailDTO & CreateUserWithPhoneDTO
