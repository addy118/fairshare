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
      console.error("Error in Split.create(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to create split.");
    }
  }

  static async createMany(splits) {
    try {
      return await db.split.createManyAndReturn({
        data: splits,
      });
    } catch (error) {
      console.error("Error in Split.createMany(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to create multiple splits.");
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
      console.error("Error in Split.get(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to fetch split.");
    }
  }

  static async delete(id) {
    try {
      await db.split.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error in Split.delete(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to delete split.");
    }
  }

  static async deleteAll(grpId) {
    try {
      await db.split.deleteMany({
        where: {
          AND: [
            { groupId: Number(grpId) },
            { confirmed: false },
            { settled: false },
          ],
        },
      });
    } catch (error) {
      console.error("Error in Split.deleteAll(): ", error.message);
      console.error(error.stack);
      throw new Error(
        error.message || "Failed to delete all unsettled splits for the group."
      );
    }
  }
}

module.exports = Split;
