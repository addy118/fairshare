const db = require("../../config/prismaClient");

class Group {
  static async expenses(id) {
    const expenses = await db.group.findMany({
      where: { id: Number(id) },
      select: { expenses: true, splits: true },
    });

    return expenses;
  }

  static async splits(id) {
    const splits = await db.group.findMany({
      where: { id: Number(id) },
      select: {
        splits: {
          select: {
            debtorId: true,
            creditorId: true,
            amount: true,
            settled: true,
          },
        },
      },
    });

    return splits;
  }
}

module.exports = Group;
