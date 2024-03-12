/*
  Warnings:

  - You are about to drop the column `createdAt` on the `days` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `days` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `habit_week_days` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `habit_week_days` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `habits` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `habits` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `day_habits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `days` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `habit_week_days` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `habits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "day_habits" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "days" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "habit_week_days" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "habits" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
