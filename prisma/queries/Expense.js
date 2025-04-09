const db = require("../../config/prismaClient");
const Group = require("./Group");

class Expense {
  static async create(exp, payersArr, splitsArr) {
    // checks whether the user present in the expense is part of the group or not
    for (const payer of payersArr) {
      const isMember = await Group.isMember(
        Number(payer.payerId),
        Number(exp.groupId)
      );

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
            paidAmt: Number(payer.paidAmt),
            payer: { connect: { id: Number(payer.payerId) } },
          })),
        },

        // create the splits relationships
        splits: {
          create: splitsArr.map((split) => ({
            name: exp.name,
            amount: Number(split.amount),
            // connect to mainGroup
            mainGroup: { connect: { id: Number(exp.groupId) } },
            // connect to debtor
            debtor: { connect: { id: Number(split.debitorId) } },
            // connect to creditor
            creditor: { connect: { id: Number(split.creditorId) } },
          })),
        },
      },
    });

    return res;
  }

  static async get(id) {
    const res = await db.expense.findFirst({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        mainGroup: { select: { id: true, name: true } },
        totalAmt: true,
        payers: {
          select: {
            payer: { select: { id: true, name: true } },
            paidAmt: true,
          },
        },
        splits: {
          select: {
            debtor: { select: { id: true, name: true } },
            creditor: { select: { id: true, name: true } },
            amount: true,
            settled: true,
          },
        },
        _count: { select: { payers: true, splits: true } },
      },
    });

    return res;
  }

  static async settle(id) {
    await db.split.update({
      where: { id: Number(id) },
      data: { settled: true },
    });
  }
}

module.exports = Expense;
