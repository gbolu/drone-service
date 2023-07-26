-- CreateEnum
CREATE TYPE "DroneModel" AS ENUM ('Lightweight', 'Middleweight', 'Cruiserweight', 'Heavyweight');

-- CreateEnum
CREATE TYPE "DroneState" AS ENUM ('IDLE', 'LOADING', 'LOADED', 'DELIVERING', 'DELIVERED', 'RETURNING');

-- CreateTable
CREATE TABLE "Drone" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "model" "DroneModel" NOT NULL DEFAULT 'Lightweight',
    "maxWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "battery" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "state" "DroneState" NOT NULL DEFAULT 'IDLE',

    CONSTRAINT "Drone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Drone_serialNumber_key" ON "Drone"("serialNumber");
