/*
  Warnings:

  - The values [BARBER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `barberId` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the `barbers` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('SUPERADMIN', 'ADMIN', 'COACH', 'CUSTOMER');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
COMMIT;

-- DropForeignKey
ALTER TABLE "barbers" DROP CONSTRAINT "barbers_userId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_barberId_fkey";

-- DropIndex
DROP INDEX "reservations_barberId_idx";

-- DropIndex
DROP INDEX "reservations_date_idx";

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "barberId",
DROP COLUMN "date",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "coachId" UUID;

-- DropTable
DROP TABLE "barbers";

-- CreateTable
CREATE TABLE "coaches" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "coaches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coaches_userId_key" ON "coaches"("userId");

-- CreateIndex
CREATE INDEX "reservations_coachId_idx" ON "reservations"("coachId");

-- AddForeignKey
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "coaches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
