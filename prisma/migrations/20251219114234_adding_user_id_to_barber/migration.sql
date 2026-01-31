/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `barbers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `barbers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "barbers" ADD COLUMN     "userId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "barbers_userId_key" ON "barbers"("userId");

-- AddForeignKey
ALTER TABLE "barbers" ADD CONSTRAINT "barbers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
