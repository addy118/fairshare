const db = require("../../config/prismaClient");

class Expense {
  static async create(exp, payersArr, splitsArr) {
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
        groupId: true,
        totalAmt: true,
        payers: { select: { payerId: true, paidAmt: true } },
        splits: {
          select: {
            debtorId: true,
            creditorId: true,
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
