const db = require("../../config/prismaClient");

class Split {
  static async create(name, groupId, debtorId, creditorId, amount) {
    await db.split.create({
      data: {
        name,
        groupId: Number(groupId),
        debtorId: Number(debtorId),
        creditorId: Number(creditorId),
        amount: Number(amount),
      },
    });
  }

  static async createMany(splits) {
    return await db.split.createManyAndReturn({
      data: splits,
    });
  }

  static async delete(id) {
    await db.split.delete({
      where: { id: Number(id) },
    });
  }

  static async deleteAll(grpId) {
    await db.split.deleteMany({
      where: {
        AND: [{ groupId: Number(grpId) }, { settled: false }],
      },
    });
  }
}

module.exports = Split;
