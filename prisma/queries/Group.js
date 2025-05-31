const db = require("../../config/prismaClient");

class Group {
  static async create(name) {
    try {
      return await db.group.create({
        data: { name },
      });
    } catch (error) {
      console.error("Error creating group: ", error.stack);
      throw new Error("Failed to create group.");
    }
  }

  static async delete(groupId) {
    try {
      await db.group.delete({
        where: { id: Number(groupId) },
      });
    } catch (error) {
      console.error("Error deleting group: ", error.stack);
      throw new Error("Failed to delete group.");
    }
  }

  static async getById(groupId) {
    try {
      return await db.group.findFirst({
        where: { id: Number(groupId) },
        select: {
          id: true,
          name: true,
          members: {
            select: {
              member: {
                select: { id: true, name: true, username: true, pfp: true },
              },
            },
          },
          expenses: { select: { id: true, name: true, totalAmt: true } },
          createdAt: true,
        },
      });
    } catch (error) {
      console.error("Error fetching group by ID: ", error.stack);
      throw new Error("Failed to fetch group by ID.");
    }
  }

  static async expenses(id) {
    try {
      const expenses = await db.group.findMany({
        where: { id },
        select: {
          expenses: {
            select: {
              id: true,
              name: true,
              totalAmt: true,
              payers: {
                select: {
                  payer: { select: { id: true, name: true, pfp: true } },
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
              debtor: { select: { id: true, name: true, pfp: true } },
              creditor: { select: { id: true, name: true, pfp: true } },
              amount: true,
              settled: true,
              confirmed: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      return expenses[0];
    } catch (error) {
      console.error("Error fetching group expenses: ", error.stack);
      throw new Error("Failed to fetch group expenses.");
    }
  }

  static async splits(id) {
    try {
      const splits = await db.group.findMany({
        where: { id },
        select: {
          splits: {
            where: { confirmed: false },
            select: {
              id: true,
              debtor: { select: { id: true, name: true, pfp: true } },
              creditor: { select: { id: true, name: true, pfp: true } },
              amount: true,
            },
          },
        },
      });

      return splits[0].splits;
    } catch (error) {
      console.error("Error fetching group splits: ", error.stack);
      throw new Error("Failed to fetch group splits.");
    }
  }

  static async join(memberId, groupId) {
    try {
      await db.member.create({
        data: { memberId, groupId: Number(groupId) },
      });
    } catch (error) {
      console.error("Error adding member to group: ", error.stack);
      throw new Error("Failed to add member to group.");
    }
  }

  static async leave(memberId, groupId) {
    try {
      await db.member.delete({
        where: {
          groupId_memberId: {
            groupId: Number(groupId),
            memberId,
          },
        },
      });
    } catch (error) {
      console.error("Error removing member from group: ", error.stack);
      throw new Error("Failed to remove member from group.");
    }
  }

  static async isMember(memberId, groupId) {
    try {
      const isMember = await db.member.findUnique({
        where: {
          groupId_memberId: {
            groupId: Number(groupId),
            memberId,
          },
        },
      });

      // returns null if not a member
      return isMember;
    } catch (error) {
      console.error("Error checking group membership: ", error.stack);
      throw new Error("Failed to check group membership.");
    }
  }

  static async members(groupId) {
    try {
      return await db.member.findMany({
        where: { groupId: Number(groupId) },
        include: { member: { select: { id: true, name: true, pfp: true } } },
      });
    } catch (error) {
      console.error("Error fetching group members: ", error.stack);
      throw new Error("Failed to fetch group members.");
    }
  }

  static async expenseHistory(groupId) {
    try {
      return await db.expense.findMany({
        where: { groupId: Number(groupId) },
        select: {
          id: true,
          name: true,
          totalAmt: true,
          createdAt: true,
          payers: {
            select: {
              payer: { select: { id: true, name: true, pfp: true } },
              paidAmt: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });
    } catch (error) {
      console.error("Error fetching expense history: ", error.stack);
      throw new Error("Failed to fetch expense history.");
    }
  }

  static async splitsHistory(groupId) {
    try {
      return await db.split.findMany({
        where: { groupId: Number(groupId), confirmed: true },
        select: {
          id: true,
          debtor: { select: { id: true, name: true, pfp: true } },
          creditor: { select: { id: true, name: true, pfp: true } },
          amount: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "asc" },
      });
    } catch (error) {
      console.error("Error fetching splits history: ", error.stack);
      throw new Error("Failed to fetch splits history.");
    }
  }
}

module.exports = Group;
