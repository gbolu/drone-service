/*
  Warnings:

  - You are about to drop the column `quantity` on the `DroneMedication` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Medication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DroneMedication" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "stock";
