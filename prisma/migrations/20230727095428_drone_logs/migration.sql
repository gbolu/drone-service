-- CreateTable
CREATE TABLE "DroneLogs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "droneId" INTEGER NOT NULL,
    "state" "DroneState" NOT NULL,
    "battery" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DroneLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DroneLogs_droneId_idx" ON "DroneLogs"("droneId");

-- CreateIndex
CREATE INDEX "DroneLogs_state_idx" ON "DroneLogs"("state");

-- AddForeignKey
ALTER TABLE "DroneLogs" ADD CONSTRAINT "DroneLogs_droneId_fkey" FOREIGN KEY ("droneId") REFERENCES "Drone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
