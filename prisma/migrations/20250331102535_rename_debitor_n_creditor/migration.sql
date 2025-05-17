/*
  Warnings:

  - You are about to drop the column `payeeId` on the `Split` table. All the data in the column will be lost.
  - You are about to drop the column `payerId` on the `Split` table. All the data in the column will be lost.
  - Added the required column `creditorId` to the `Split` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debtorId` to the `Split` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Split" DROP CONSTRAINT "Split_payeeId_fkey";

-- DropForeignKey
ALTER TABLE "Split" DROP CONSTRAINT "Split_payerId_fkey";

-- AlterTable
ALTER TABLE "Split" DROP COLUMN "payeeId",
DROP COLUMN "payerId",
ADD COLUMN     "creditorId" INTEGER NOT NULL,
ADD COLUMN     "debtorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Split" ADD CONSTRAINT "Split_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Split" ADD CONSTRAINT "Split_creditorId_fkey" FOREIGN KEY ("creditorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
