/*
  Warnings:

  - You are about to alter the column `hourlyRate` on the `tutor_profile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "tutor_profile" ALTER COLUMN "hourlyRate" SET DATA TYPE DECIMAL(10,2);
