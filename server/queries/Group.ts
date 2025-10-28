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
import AppError from "../utils/AppError";

class Group {
  static async create(name: string): Promise<GroupBaseDB | undefined> {
    const group = await db.group.create({
      data: { name },
    });

    if (!group) throw new Error("Failed to create group.");
    return group;
  }

  static async delete(groupId: number): Promise<void> {
    await db.group.delete({
      where: { id: Number(groupId) },
    });
  }

  static async getById(groupId: number): Promise<CompleteGroup | undefined> {
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
  }

  static async getNameById(groupId: number): Promise<string> {
    const group = await db.group.findUnique({
      where: { id: groupId },
      select: { name: true },
    });

    if (!group) throw new AppError("Group not found", 404, "Group.getNameById");
    return group?.name;
  }

  static async expenses(id: number): Promise<GroupTrans | undefined> {
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
  }

  static async splits(id: number): Promise<SplitHistory[] | undefined> {
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
  }

  static async expenseHistory(
    groupId: number
  ): Promise<CompleteExpense[] | undefined> {
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
  }

  static async splitsHistory(
    groupId: number
  ): Promise<SplitHistory[] | undefined> {
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
  }

  static async members(groupId: number): Promise<Member[] | undefined> {
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
  }

  static async join(memberId: string, groupId: number): Promise<void> {
    await db.member.create({
      data: { memberId, groupId: groupId },
    });
  }

  static async leave(memberId: string, groupId: number): Promise<void> {
    await db.member.delete({
      where: {
        groupId_memberId: {
          groupId: Number(groupId),
          memberId,
        },
      },
    });
  }

  static async isMember(
    memberId: string,
    groupId: number
  ): Promise<BaseMember | null | undefined> {
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
  }
}

export default Group;
