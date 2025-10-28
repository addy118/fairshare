import db from "../config/prismaClient";
import { ExpenseSplits, SplitDB, SplitStd } from "../types";

class Split {
  static async create(
    name: string,
    groupId: number,
    debtorId: string,
    creditorId: string,
    amount: number
  ): Promise<void> {
    await db.split.create({
      data: {
        name,
        groupId,
        debtorId,
        creditorId,
        amount,
      },
    });
  }

  static async createMany(
    splits: SplitStd[]
  ): Promise<ExpenseSplits[] | undefined> {
    const totalSplits = await db.split.createManyAndReturn({
      data: splits,
    });

    if (!totalSplits) throw new Error("Unable to create splits for expense.");
    return totalSplits;
  }

  static async get(id: number): Promise<SplitDB | undefined> {
    const split = await db.split.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        groupId: true,
        expenseId: true,
        debtor: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            pfp: true,
            upi: true,
          },
        },
        creditor: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            pfp: true,
            upi: true,
          },
        },
        amount: true,
        settled: true,
        confirmed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!split) throw new Error("Unable to fetch split.");
    return split;
  }

  static async delete(id: number): Promise<void> {
    await db.split.delete({ where: { id } });
  }

  static async deleteAll(grpId: number): Promise<void> {
    await db.split.deleteMany({
      where: {
        AND: [
          { groupId: Number(grpId) },
          { confirmed: false },
          { settled: false },
        ],
      },
    });
  }
}

export default Split;
