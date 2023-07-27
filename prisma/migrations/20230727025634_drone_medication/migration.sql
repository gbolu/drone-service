-- CreateTable
CREATE TABLE "DroneMedication" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "droneId" INTEGER NOT NULL,
    "medicationId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "DroneMedication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DroneMedication_droneId_idx" ON "DroneMedication"("droneId");

-- CreateIndex
CREATE INDEX "DroneMedication_medicationId_idx" ON "DroneMedication"("medicationId");

-- AddForeignKey
ALTER TABLE "DroneMedication" ADD CONSTRAINT "DroneMedication_droneId_fkey" FOREIGN KEY ("droneId") REFERENCES "Drone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
