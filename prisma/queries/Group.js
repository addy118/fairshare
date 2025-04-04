const db = require("../../config/prismaClient");

class Group {
  static async expenses(id) {
    const expenses = await db.group.findMany({
      where: { id: Number(id) },
      select: {
        expenses: {
          select: {
            id: true,
            name: true,
            totalAmt: true,
            payers: { omit: { expenseId: true } },
            createdAt: true,
          },
        },
        splits: true,
      },
    });

    return expenses;
  }

  static async splits(id) {
    const splits = await db.group.findMany({
      where: { id: Number(id) },
      select: {
        splits: {
          where: { settled: false },
          select: {
            debtorId: true,
            creditorId: true,
            amount: true,
          },
        },
      },
    });

    return splits;
  }

  static async join(memberId, groupId) {
    await db.member.create({
      data: { memberId: Number(memberId), groupId: Number(groupId) },
    });
  }

  static async leave(memberId, groupId) {
    await db.member.delete({
      where: {
        groupId_memberId: {
          groupId: Number(groupId),
          memberId: Number(memberId),
        },
      },
    });
  }
}

module.exports = Group;
