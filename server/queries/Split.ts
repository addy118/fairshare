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
    try {
      await db.split.create({
        data: {
          name,
          groupId,
          debtorId,
          creditorId,
          amount,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Split.create(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to create split.");
      }
    }
  }

  static async createMany(
    splits: SplitStd[]
  ): Promise<ExpenseSplits[] | undefined> {
    try {
      const totalSplits = await db.split.createManyAndReturn({
        data: splits,
      });

      if (!totalSplits) throw new Error("Unable to create splits for expense.");
      return totalSplits;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Split.createMany(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to create multiple splits.");
      }
    }
  }

  static async get(id: number): Promise<SplitDB | undefined> {
    try {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Split.get(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to fetch split.");
      }
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      await db.split.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Split.delete(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to delete split.");
      }
    }
  }

  static async deleteAll(grpId: number): Promise<void> {
    try {
      await db.split.deleteMany({
        where: {
          AND: [
            { groupId: Number(grpId) },
            { confirmed: false },
            { settled: false },
          ],
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Split.deleteAll(): ", error.message);
        console.error(error.stack);
        throw new Error(
          error.message ||
            "Failed to delete all unsettled splits for the group."
        );
      }
    }
  }
}

export default Split;
