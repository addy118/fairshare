const db = require("../../config/prismaClient");

class Split {
  static async create(name, groupId, debtorId, creditorId, amount) {
    try {
      await db.split.create({
        data: {
          name,
          groupId: Number(groupId),
          debtorId: debtorId,
          creditorId: creditorId,
          amount: Number(amount),
        },
      });
    } catch (error) {
      console.error("Error creating split: ", error.stack);
      throw new Error("Failed to create split.");
    }
  }

  static async createMany(splits) {
    try {
      return await db.split.createManyAndReturn({
        data: splits,
      });
    } catch (error) {
      console.error("Error creating multiple splits: ", error.stack);
      throw new Error("Failed to create multiple splits.");
    }
  }

  static async get(id) {
    try {
      return await db.split.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          groupId: true,
          expenseId: true,
          debtor: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              username: true,
              pfp: true,
              upi: true,
            },
          },
          creditor: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              username: true,
              pfp: true,
              upi: true,
            },
          },
          amount: true,
          settled: true,
          confirmed: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error("Error fetching split: ", error.stack);
      throw new Error("Failed to fetch split.");
    }
  }

  static async delete(id) {
    try {
      await db.split.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error deleting split: ", error.stack);
      throw new Error("Failed to delete split.");
    }
  }

  static async deleteAll(grpId) {
    try {
      await db.split.deleteMany({
        where: {
          AND: [{ groupId: Number(grpId) }, { confirmed: false }],
        },
      });
    } catch (error) {
      console.error("Error deleting all unsettled splits: ", error.stack);
      throw new Error("Failed to delete all unsettled splits for the group.");
    }
  }
}

module.exports = Split;
