/*
  Warnings:

  - You are about to drop the `DroneLogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DroneLogs" DROP CONSTRAINT "DroneLogs_droneId_fkey";

-- DropTable
DROP TABLE "DroneLogs";

-- CreateTable
CREATE TABLE "DroneLog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "droneId" INTEGER NOT NULL,
    "state" "DroneState" NOT NULL,
    "battery" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DroneLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DroneLog_droneId_idx" ON "DroneLog"("droneId");

-- CreateIndex
CREATE INDEX "DroneLog_state_idx" ON "DroneLog"("state");

-- AddForeignKey
ALTER TABLE "DroneLog" ADD CONSTRAINT "DroneLog_droneId_fkey" FOREIGN KEY ("droneId") REFERENCES "Drone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
