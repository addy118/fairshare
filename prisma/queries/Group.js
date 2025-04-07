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
            id: true,
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
      select: { memberId: true },
    });
  }

  static async expenseHistory(groupId) {
    return await db.expense.findMany({
      where: { groupId: Number(groupId) },
      select: {
        name: true,
        totalAmt: true,
        createdAt: true,
        payers: {
          select: { payerId: true, paidAmt: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  static async splitsHistory(groupId) {
    return await db.split.findMany({
      where: { groupId: Number(groupId), settled: true },
      select: {
        debtorId: true,
        creditorId: true,
        amount: true,
        updatedAt: true,
        name: true,
      },
      orderBy: { updatedAt: "asc" },
    });
  }
}

module.exports = Group;
