const db = require("../../config/prismaClient");

class User {
  static async create(name, username, email, password) {
    try {
      const user = await db.user.create({
        data: { name, username, phone, email, password },
      });
      return user;
    } catch (error) {
      console.error("Error creating user:  ", error.stack);
      throw new Error("Failed to create user.");
    }
  }

  static async changeEmail(userId, email) {
    try {
      await db.user.update({
        where: { id: userId },
        data: { email },
      });
    } catch (error) {
      console.error("Error changing email:  ", error.stack);
      throw new Error("Failed to update user email.");
    }
  }

  static async changeName(userId, name) {
    try {
      await db.user.update({
        where: { id: userId },
        data: { name },
      });
    } catch (error) {
      console.error("Error updating name:  ", error.stack);
      throw new Error("Failed to update user name.");
    }
  }

  static async changePass(userId, password) {
    try {
      await db.user.update({
        where: { id: userId },
        data: { password },
      });
    } catch (error) {
      console.error("Error updating password:  ", error.stack);
      throw new Error("Failed to update user password.");
    }
  }

  static async get(data) {
    try {
      const user = await db.user.findFirst({
        where: {
          OR: [{ username: data }, { email: data }],
        },
      });
      return user;
    } catch (error) {
      console.error("Error fetching user by email/username:  ", error.stack);
      throw new Error("Failed to fetch user by email/username");
    }
  }

  static async getById(id) {
    try {
      const user = await db.user.findUnique({
        where: { id },
        omit: { password: true },
      });
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:  ", error.stack);
      throw new Error("Failed to fetch user by ID.");
    }
  }

  static async balance(id) {
    const balance = await db.user.findFirst({
      where: { id: Number(id) },
      select: {
        // amount to be debited
        debtor: {
          select: {
            creditor: { select: { id: true, name: true } },
            amount: true,
          },
        },
        // amount to get credited
        creditor: {
          select: {
            debtor: { select: { id: true, name: true } },
            amount: true,
          },
        },
      },
    });

    return balance;
  }

  // static async getByEmail(email) {
  //   try {
  //     const user = await db.user.findUnique({
  //       where: { email },
  //     });
  //     return user;
  //   } catch (error) {
  //     console.error("Error fetching user by email:  ", error.stack);
  //     throw new Error("Failed to fetch user by email.");
  //   }
  // }

  static async delete(userId) {
    try {
      await db.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      console.error("Error deleting user:  ", error.stack);
      throw new Error("Failed to delete user.");
    }
  }
}

module.exports = User;
