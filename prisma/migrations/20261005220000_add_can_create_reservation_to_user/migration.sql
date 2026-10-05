-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "canCreateReservation" BOOLEAN NOT NULL DEFAULT true;
