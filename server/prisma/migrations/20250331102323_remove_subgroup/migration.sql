/*
  Warnings:

  - You are about to drop the column `paidAmt` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `payerId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `subId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the `SubGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSub` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groupId` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_payerId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_subId_fkey";

-- DropForeignKey
ALTER TABLE "SubGroup" DROP CONSTRAINT "SubGroup_groupId_fkey";

-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_groupId_fkey";

-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_memberId_fkey";

-- DropForeignKey
ALTER TABLE "UserSub" DROP CONSTRAINT "UserSub_memberId_fkey";

-- DropForeignKey
ALTER TABLE "UserSub" DROP CONSTRAINT "UserSub_subId_fkey";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "paidAmt",
DROP COLUMN "payerId",
DROP COLUMN "subId",
ADD COLUMN     "groupId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "SubGroup";

-- DropTable
DROP TABLE "UserGroup";

-- DropTable
DROP TABLE "UserSub";

-- CreateTable
CREATE TABLE "Member" (
    "memberId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("groupId","memberId")
);

-- CreateTable
CREATE TABLE "Payer" (
    "payerId" INTEGER NOT NULL,
    "expenseId" INTEGER NOT NULL,
    "paidAmt" INTEGER NOT NULL,

    CONSTRAINT "Payer_pkey" PRIMARY KEY ("expenseId","payerId")
);

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payer" ADD CONSTRAINT "Payer_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payer" ADD CONSTRAINT "Payer_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
