const db = require("../../config/prismaClient");

class Group {
  static async create(name) {
    try {
      return await db.group.create({
        data: { name },
      });
    } catch (error) {
      console.error("Error in Group.create(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to create group.");
    }
  }

  static async delete(groupId) {
    try {
      await db.group.delete({
        where: { id: Number(groupId) },
      });
    } catch (error) {
      console.error("Error in Group.delete(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to delete group.");
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
                select: {
                  id: true,
                  name: true,
                  username: true,
                  pfp: true,
                  upi: true,
                },
              },
            },
          },
          expenses: { select: { id: true, name: true, totalAmt: true } },
          createdAt: true,
        },
      });
    } catch (error) {
      console.error("Error in Group.getById(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to fetch group by ID.");
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
                  payer: {
                    select: { id: true, name: true, pfp: true, upi: true },
                  },
                  paidAmt: true,
                },
              },
              createdAt: true,
            },
          },
          splits: {
            // where: {
            //   AND: [{ confirmed: false }, { settled: false }],
            // },
            select: {
              id: true,
              mainGroup: { select: { id: true, name: true } },
              debtor: {
                select: { id: true, name: true, pfp: true, upi: true },
              },
              creditor: {
                select: { id: true, name: true, pfp: true, upi: true },
              },
              amount: true,
              settled: true,
              confirmed: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      // console.log(expenses[0]);
      return expenses[0];
    } catch (error) {
      console.error("Error in Group.expenses(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to fetch group expenses.");
    }
  }

  static async splits(id) {
    try {
      const splits = await db.group.findMany({
        where: { id },
        select: {
          splits: {
            where: {
              AND: [{ confirmed: false }, { settled: false }],
            },
            select: {
              id: true,
              name: true,
              debtor: {
                select: { id: true, name: true, pfp: true, upi: true },
              },
              creditor: {
                select: { id: true, name: true, pfp: true, upi: true },
              },
              amount: true,
            },
          },
        },
      });

      return splits[0].splits;
    } catch (error) {
      console.error("Error in Group.splits(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to fetch group splits.");
    }
  }

  static async join(memberId, groupId) {
    try {
      await db.member.create({
        data: { memberId, groupId: Number(groupId) },
      });
    } catch (error) {
      console.error("Error in Group.join(): ", error.message);
      console.error(error.stack);

      // unique constraint violation
      if (error.code === "P2002")
        throw new Error("Member is already in the group.");

      throw new Error(error.message || "Failed to add member to group.");
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
      console.error("Error in Group.leave(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to remove member from group.");
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
      console.error("Error in Group.isMember(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to check group membership.");
    }
  }

  static async members(groupId) {
    try {
      return await db.member.findMany({
        where: { groupId: Number(groupId) },
        include: {
          member: {
            select: {
              id: true,
              name: true,
              username: true,
              pfp: true,
              upi: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error in Group.members(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to fetch group members.");
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
        },
        orderBy: { createdAt: "asc" },
      });
    } catch (error) {
      console.error("Error in Group.expenseHistory(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to fetch expense history.");
    }
  }

  static async splitsHistory(groupId) {
    try {
      return await db.split.findMany({
        where: { groupId: Number(groupId), confirmed: true },
        select: {
          id: true,
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
          updatedAt: true,
        },
        orderBy: { updatedAt: "asc" },
      });
    } catch (error) {
      console.error("Error in Group.splitsHistory(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to fetch splits history.");
    }
  }
}

module.exports = Group;
