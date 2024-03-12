/*
  Warnings:

  - Added the required column `updatedAt` to the `days` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `habit_week_days` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "days" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "habit_week_days" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
