import { PrismaClient } from '@prisma/client'

export class Repository {
  protected readonly _prisma: PrismaClient

  constructor() {
    this._prisma = new PrismaClient()
  }
}
