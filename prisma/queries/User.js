const db = require("../../config/prismaClient");

class User {
  static async create(name, username, phone, email, password) {
    try {
      const user = await db.user.create({
        data: { name, username, phone, email, password },
      });
      return user;
    } catch (error) {
      console.error("Error creating user: ", error.stack);
      if (error.code === "P2002") {
        // Handling unique constraint violation
        throw new Error(
          "A user with this email, phone or username already exists."
        );
      }
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
      console.error("Error changing email: ", error.stack);
      if (error.code === "P2002") {
        // Handling unique constraint violation
        throw new Error("Email is already taken.");
      }
      throw new Error("Failed to update user's email.");
    }
  }

  static async changeName(userId, name) {
    try {
      await db.user.update({
        where: { id: userId },
        data: { name },
      });
    } catch (error) {
      console.error("Error updating name: ", error.stack);
      throw new Error("Failed to update user's name.");
    }
  }

  static async changeUserName(userId, username) {
    try {
      await db.user.update({
        where: { id: userId },
        data: { username },
      });
    } catch (error) {
      console.error("Error updating username: ", error.stack);
      throw new Error("Failed to update user's username.");
    }
  }

  static async changePhone(userId, phone) {
    try {
      await db.user.update({
        where: { id: userId },
        data: { phone },
      });
    } catch (error) {
      console.error("Error updating name: ", error.stack);
      throw new Error("Failed to update user's phone.");
    }
  }

  static async changePass(userId, password) {
    try {
      await db.user.update({
        where: { id: userId },
        data: { password },
      });
    } catch (error) {
      console.error("Error updating password: ", error.stack);
      throw new Error("Failed to update user password.");
    }
  }

  static async getBasicInfo(id) {
    try {
      return await db.user.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          phone: true,
        },
      });
    } catch (error) {
      console.error("Error fetching user info: ", error.stack);
      throw new Error("Failed to fetch user info.");
    }
  }

  static async get(data) {
    try {
      const user = await db.user.findFirst({
        where: {
          OR: [{ username: data }, { email: data }],
        },
        select: {
          id: true,
          name: true,
          username: true,
          phone: true,
          email: true,
          password: true,
          groups: {
            select: {
              group: {
                select: {
                  id: true,
                  name: true,
                  members: {
                    select: {
                      member: {
                        select: { id: true, name: true, username: true },
                      },
                    },
                  },
                  createdAt: true,
                },
              },
            },
          },
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      console.error("Error fetching user by email/username: ", error.stack);
      throw new Error("Failed to fetch user by email/username.");
    }
  }

  static async getNameById(id) {
    try {
      const user = await db.user.findUnique({
        where: { id },
        select: { name: true },
      });
      return user.name;
    } catch (error) {
      console.error("Error fetching name by ID: ", error.stack);
      throw new Error("Failed to fetch name by ID.");
    }
  }

  static async getIdbyUserName(username) {
    try {
      const userId = await db.user.findFirst({
        where: { username },
        select: { id: true },
      });
      return Number(userId.id);
    } catch (error) {
      console.error("Error fetching ID by username: ", error.stack);
      throw new Error("Failed to fetch ID by username.");
    }
  }

  static async getById(id) {
    try {
      const user = await db.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          username: true,
          phone: true,
          email: true,
          groups: {
            select: {
              group: {
                select: {
                  id: true,
                  name: true,
                  members: {
                    select: {
                      member: {
                        select: { id: true, name: true, username: true },
                      },
                    },
                  },
                  createdAt: true,
                },
              },
            },
          },
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      console.error("Error fetching user by ID: ", error.stack);
      throw new Error("Failed to fetch user by ID.");
    }
  }

  static async balance(id) {
    try {
      const balance = await db.user.findFirst({
        where: { id: Number(id) },
        select: {
          debtor: {
            select: {
              creditor: { select: { id: true, name: true } },
              amount: true,
            },
          },
          creditor: {
            select: {
              debtor: { select: { id: true, name: true } },
              amount: true,
            },
          },
        },
      });
      return balance;
    } catch (error) {
      console.error("Error fetching balance: ", error.stack);
      throw new Error("Failed to fetch balance.");
    }
  }

  static async delete(userId) {
    try {
      await db.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      console.error("Error deleting user: ", error.stack);
      throw new Error("Failed to delete user.");
    }
  }
}

module.exports = User;
