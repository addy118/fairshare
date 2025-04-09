const db = require("../../config/prismaClient");

class Group {
  static async create(name) {
    return await db.group.create({
      data: { name },
    });
  }

  static async delete(groupId) {
    await db.group.delete({
      where: { id: Number(groupId) },
    });
  }

  static async expenses(id) {
    const expenses = await db.group.findMany({
      where: { id: Number(id) },
      select: {
        expenses: {
          select: {
            id: true,
            name: true,
            totalAmt: true,
            payers: {
              select: {
                payer: { select: { id: true, name: true } },
                paidAmt: true,
              },
            },
            createdAt: true,
          },
        },
        splits: {
          select: {
            id: true,
            mainGroup: { select: { id: true, name: true } },
            debtor: { select: { id: true, name: true } },
            creditor: { select: { id: true, name: true } },
            amount: true,
            settled: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return expenses[0];
  }

  static async splits(id) {
    const splits = await db.group.findMany({
      where: { id: Number(id) },
      select: {
        splits: {
          where: { settled: false },
          select: {
            id: true,
            debtor: { select: { id: true, name: true } },
            creditor: { select: { id: true, name: true } },
            amount: true,
          },
        },
      },
    });

    return splits[0].splits;
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

  static async isMember(memberId, groupId) {
    const isMember = await db.member.findUnique({
      where: {
        groupId_memberId: {
          groupId: Number(groupId),
          memberId: Number(memberId),
        },
      },
    });

    // returns null if not a member
    return isMember;
  }

  static async members(groupId) {
    return await db.member.findMany({
      where: { groupId: Number(groupId) },
      include: { member: { select: { id: true, name: true } } },
    });
  }

  static async expenseHistory(groupId) {
    return await db.expense.findMany({
      where: { groupId: Number(groupId) },
      select: {
        id: true,
        name: true,
        totalAmt: true,
        createdAt: true,
        payers: {
          select: {
            payer: { select: { id: true, name: true } },
            paidAmt: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  static async splitsHistory(groupId) {
    return await db.split.findMany({
      where: { groupId: Number(groupId), settled: true },
      select: {
        id: true,
        debtor: { select: { id: true, name: true } },
        creditor: { select: { id: true, name: true } },
        amount: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "asc" },
    });
  }
}

module.exports = Group;
