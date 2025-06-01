const db = require("../../config/prismaClient");
const Group = require("./Group");

class Expense {
  static async create(exp, payersArr, splitsArr) {
    try {
      // checks whether the user present in the expense is part of the group or not
      for (const payer of payersArr) {
        const isMember = await Group.isMember(
          payer.payerId,
          Number(exp.groupId)
        );

        if (!isMember) {
          throw new Error(
            `User with ID ${payer.payerId} is not a member of the group with ID ${exp.groupId}`
          );
        }
      }

      splitsArr.map((split) => {
        console.log(split);
      });

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
              payer: { connect: { id: payer.payerId } },
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
              debtor: { connect: { id: split.debitorId } },
              // connect to creditor
              creditor: { connect: { id: split.creditorId } },
            })),
          },
        },
      });

      return res;
    } catch (error) {
      console.error("Error creating expense: ", error.stack);
      throw new Error(error.message || "Failed to create expense.");
    }
  }

  static async get(id) {
    try {
      const res = await db.expense.findFirst({
        where: { id },
        select: {
          id: true,
          name: true,
          mainGroup: { select: { id: true, name: true } },
          totalAmt: true,
          payers: {
            select: {
              payer: { select: { id: true, name: true, pfp: true, upi: true } },
              paidAmt: true,
            },
          },
          splits: {
            select: {
              debtor: {
                select: { id: true, name: true, pfp: true, upi: true },
              },
              creditor: {
                select: { id: true, name: true, pfp: true, upi: true },
              },
              amount: true,
              settled: true,
              confirmed: true,
            },
          },
          _count: { select: { payers: true, splits: true } },
        },
      });

      return res;
    } catch (error) {
      console.error("Error fetching expense: ", error.stack);
      throw new Error("Failed to fetch expense details.");
    }
  }

  static async settle(id) {
    try {
      await db.split.update({
        where: { id },
        data: { settled: true },
      });
    } catch (error) {
      console.error("Error settling split: ", error.stack);
      throw new Error("Failed to settle split.");
    }
  }

  static async confirm(id) {
    try {
      await db.split.update({
        where: { id },
        data: { settled: true, confirmed: true },
      });
    } catch (error) {
      console.error("Error confirming split: ", error.stack);
      throw new Error("Failed to confirm split.");
    }
  }

  static async notConfirm(id) {
    try {
      await db.split.update({
        where: { id },
        data: { settled: false, confirmed: false },
      });
    } catch (error) {
      console.error("Error not confirming split: ", error.stack);
      throw new Error("Failed to confirm split.");
    }
  }
}

module.exports = Expense;
