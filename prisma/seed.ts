import { DroneModel, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const lightweightDrones = [
  {
    serialNumber: 'DJI Mavic Mini',
    model: DroneModel.Lightweight,
    maxWeight: 100,
    battery: 100
  },
  {
    serialNumber: 'DJI Mavic Small',
    model: DroneModel.Lightweight,
    maxWeight: 50,
    battery: 50
  },
  {
    serialNumber: 'DJI Mavic Tiny',
    model: DroneModel.Lightweight,
    maxWeight: 25,
    battery: 10
  }
]

const MiddleweightDrones = [
  {
    serialNumber: 'DJI Mavic Medium',
    model: DroneModel.Middleweight,
    maxWeight: 150,
    battery: 100
  },
  {
    serialNumber: 'DJI Mavic Medium II',
    model: DroneModel.Middleweight,
    maxWeight: 200,
    battery: 50
  },
  {
    serialNumber: 'DJI Mavic Medium III',
    model: DroneModel.Middleweight,
    maxWeight: 300,
    battery: 50
  }
]

const CruserweightDrones = [
  {
    serialNumber: 'DJI Mavic Max',
    model: DroneModel.Cruiserweight,
    maxWeight: 350,
    battery: 100
  },
  {
    serialNumber: 'DJI Mavic Max Premium',
    model: DroneModel.Cruiserweight,
    maxWeight: 400,
    battery: 100
  },
  {
    serialNumber: 'DJI Mavic Max Pro',
    model: DroneModel.Cruiserweight,
    maxWeight: 450,
    battery: 100
  }
]

const HeavyweightDrones = [
  {
    serialNumber: 'DJI Mavic Maximum',
    model: DroneModel.Heavyweight,
    maxWeight: 500,
    battery: 100
  }
]

async function main() {
  await prisma.drone.createMany({
    data: [...lightweightDrones, ...MiddleweightDrones, ...CruserweightDrones, ...HeavyweightDrones]
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
