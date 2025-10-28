import db from "../config/prismaClient";
import {
  ExpenseDB,
  ExpenseWithSplits,
  PayerStd,
  RawExpense,
  SplitStd,
} from "../types";
import Group from "./Group";

class Expense {
  static async create(
    exp: RawExpense,
    payersArr: PayerStd[],
    splitsArr: SplitStd[]
  ): Promise<ExpenseDB | undefined> {
    // checks whether the user present in the expense is part of the group or not
    for (const payer of payersArr) {
      const isMember = await Group.isMember(payer.payerId, Number(exp.groupId));

      if (!isMember) {
        throw new Error(
          `User with ID ${payer.payerId} is not a member of the group with ID ${exp.groupId}`
        );
      }
    }

    const res = await db.expense.create({
      data: {
        name: exp.name,
        totalAmt: Number(exp.totalAmt),
        // connect to the existing Group by ID
        mainGroup: { connect: { id: Number(exp.groupId) } },

        // create the payers relationships
        payers: {
          create: payersArr.map((payer) => ({
            paidAmt: payer.paidAmt,
            payer: { connect: { id: payer.payerId } },
          })),
        },

        // create the splits relationships
        splits: {
          create: splitsArr.map((split) => ({
            name: exp.name,
            amount: split.amount,
            // connect to mainGroup
            mainGroup: { connect: { id: Number(exp.groupId) } },
            // connect to debtor
            debtor: { connect: { id: split.debtorId } },
            // connect to creditor
            creditor: { connect: { id: split.creditorId } },
          })),
        },
      },
    });

    return res;
  }

  static async get(id: number): Promise<ExpenseWithSplits | undefined> {
    const res = await db.expense.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        mainGroup: { select: { id: true, name: true } },
        totalAmt: true,
        payers: {
          select: {
            payer: {
              select: {
                id: true,
                name: true,
                username: true,
                pfp: true,
                upi: true,
              },
            },
            paidAmt: true,
          },
        },
        splits: {
          select: {
            debtor: {
              select: {
                id: true,
                name: true,
                username: true,
                pfp: true,
                upi: true,
              },
            },
            creditor: {
              select: {
                id: true,
                name: true,
                username: true,
                pfp: true,
                upi: true,
              },
            },
            amount: true,
            settled: true,
            confirmed: true,
          },
        },
        _count: { select: { payers: true, splits: true } },
      },
    });

    if (!res) throw new Error("Unable to fetch expense.");
    return res;
  }

  static async settle(id: number): Promise<void> {
    await db.split.update({
      where: { id },
      data: { settled: true },
    });
  }

  static async confirm(id: number): Promise<void> {
    await db.split.update({
      where: { id },
      data: { settled: true, confirmed: true },
    });
  }

  static async notConfirm(id: number): Promise<void> {
    await db.split.update({
      where: { id },
      data: { settled: false, confirmed: false },
    });
  }
}

export default Expense;
