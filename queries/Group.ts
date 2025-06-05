import {
  BaseMember,
  CompleteExpense,
  CompleteGroup,
  GroupBaseDB,
  GroupTrans,
  Member,
  SplitHistory,
} from "../types";
import db from "../config/prismaClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class Group {
  static async create(name: string): Promise<GroupBaseDB | undefined> {
    try {
      const group = await db.group.create({
        data: { name },
      });

      if (!group) throw new Error("Failed to create group.");
      return group;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Group.create(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to create group.");
      }
    }
  }

  static async delete(groupId: number): Promise<void> {
    try {
      await db.group.delete({
        where: { id: Number(groupId) },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Group.delete(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to delete group.");
      }
    }
  }

  static async getById(groupId: number): Promise<CompleteGroup | undefined> {
    try {
      const group = await db.group.findFirst({
        where: { id: groupId },
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

      if (!group) throw new Error("Failed to fetch group.");
      return group;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Group.getById(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to fetch group by ID.");
      }
    }
  }

  static async expenses(id: number): Promise<GroupTrans | undefined> {
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
                    select: {
                      id: true,
                      name: true,
                      pfp: true,
                      upi: true,
                      username: true,
                    },
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
                select: {
                  id: true,
                  name: true,
                  pfp: true,
                  upi: true,
                  username: true,
                },
              },
              creditor: {
                select: {
                  id: true,
                  name: true,
                  pfp: true,
                  upi: true,
                  username: true,
                },
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

      if (!expenses[0]) throw new Error("Failed to fetch group transactions.");
      return expenses[0];
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Group.expenses(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to fetch group expenses.");
      }
    }
  }

  static async splits(id: number): Promise<SplitHistory[] | undefined> {
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
                select: {
                  id: true,
                  name: true,
                  pfp: true,
                  upi: true,
                  username: true,
                },
              },
              creditor: {
                select: {
                  id: true,
                  name: true,
                  pfp: true,
                  upi: true,
                  username: true,
                },
              },
              amount: true,
            },
          },
        },
      });

      if (!splits[0] || !splits[0].splits)
        throw new Error("Failed to fetch group splits.");
      return splits[0].splits;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Group.splits(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to fetch group splits.");
      }
    }
  }

  static async expenseHistory(
    groupId: number
  ): Promise<CompleteExpense[] | undefined> {
    try {
      const expenseHistory = await db.expense.findMany({
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

      if (!expenseHistory) throw new Error("Failed to fetch expense history.");
      return expenseHistory;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Group.expenseHistory(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to fetch expense history.");
      }
    }
  }

  static async splitsHistory(
    groupId: number
  ): Promise<SplitHistory[] | undefined> {
    try {
      const splitsHistory = await db.split.findMany({
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

      if (!splitsHistory) throw new Error("Failed to fetch splits history.");
      return splitsHistory;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Group.splitsHistory(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to fetch splits history.");
      }
    }
  }

  static async members(groupId: number): Promise<Member[] | undefined> {
    try {
      const members = await db.member.findMany({
        where: { groupId },
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

      if (!members) throw new Error("Unable to retrieve members.");
      return members;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Group.members(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to fetch group members.");
      }
    }
  }

  static async join(memberId: string, groupId: number): Promise<void> {
    try {
      await db.member.create({
        data: { memberId, groupId: groupId },
      });
    } catch (error: unknown) {
      // unique constraint violation
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("Member is already in the group.");
      }

      if (error instanceof Error) {
        console.error("Error in Group.join(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to add member to group.");
      }
    }
  }

  static async leave(memberId: string, groupId: number): Promise<void> {
    try {
      await db.member.delete({
        where: {
          groupId_memberId: {
            groupId: Number(groupId),
            memberId,
          },
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Group.leave(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to remove member from group.");
      }
    }
  }

  static async isMember(
    memberId: string,
    groupId: number
  ): Promise<BaseMember | null | undefined> {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in Group.isMember(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to check group membership.");
      }
    }
  }
}

export default Group;
