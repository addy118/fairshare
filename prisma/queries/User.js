const db = require("../../config/prismaClient");

class User {
  static async create(clerkUser) {
    try {
      return await db.user.create({
        data: {
          id: clerkUser.id,
          name: `${clerkUser.first_name} ${clerkUser.last_name}`,
          username: clerkUser.username,
          email: clerkUser.email_addresses[0].email_address,
          createdAt: new Date(clerkUser.created_at),
          updatedAt: new Date(clerkUser.updated_at),
          pfp: clerkUser.image_url,
        },
      });
    } catch (error) {
      console.error("Error in User.create(): ", error.message);
      console.error(error.stack);
      if (error.code === "P2002") {
        // handling unique constraint violation
        throw new Error(
          error.message || "A user with this email or username already exists."
        );
      }
      throw new Error(error.message || "Failed to create user.");
    }
  }

  static async update(clerkUser) {
    try {
      return await db.user.update({
        where: { id: clerkUser.id },
        data: {
          name: `${clerkUser.first_name} ${clerkUser.last_name}`,
          username: clerkUser.username,
          email: clerkUser.email_addresses[0].email_address,
          updatedAt: new Date(clerkUser.updated_at),
          pfp: clerkUser.image_url,
        },
      });
    } catch (error) {
      console.error("Error in User.update(): ", error.message);
      console.error(error.stack);
      if (error.code === "P2002") {
        // handling unique constraint violation
        throw new Error(
          error.message || "A user with this email or username already exists."
        );
      }
      throw new Error(error.message || "Failed to create user.");
    }
  }

  static async getBasicInfo(id) {
    try {
      return await db.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          pfp: true,
          upi: true,
        },
      });
    } catch (error) {
      console.error("Error in User.getBasicInfo(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to fetch user info.");
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
          pfp: true,
          name: true,
          username: true,
          email: true,
          upi: true,
          groups: {
            select: {
              group: {
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
                          upi: true,
                          pfp: true,
                        },
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
      console.error("Error in User.get(): ", error.message);
      console.error(error.stack);
      throw new Error(
        error.message || "Failed to fetch user by email/username."
      );
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
      console.error("Error in User.getNameById(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to fetch name by ID.");
    }
  }

  static async getPfpById(id) {
    try {
      const user = await db.user.findUnique({
        where: { id },
        select: { pfp: true },
      });
      return user.pfp;
    } catch (error) {
      console.error("Error in User.getPfpById(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to fetch pfp by ID.");
    }
  }

  static async getIdbyUserName(username) {
    try {
      const userId = await db.user.findFirst({
        where: { username },
        select: { id: true },
      });
      if (!userId) {
        throw new Error(
          error.message || "No user found with the given username."
        );
      }
      return userId.id;
    } catch (error) {
      console.error("Error in getIdbyUserName(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to fetch ID by username.");
    }
  }

  static async getById(id) {
    try {
      const user = await db.user.findUnique({
        where: { id },
        select: {
          id: true,
          pfp: true,
          name: true,
          username: true,
          email: true,
          upi: true,
          groups: {
            select: {
              group: {
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
      console.error("Error in User.getById(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to fetch user by ID.");
    }
  }

  static async groups(id) {
    try {
      const response = await db.user.findUnique({
        where: { id },
        select: {
          groups: {
            select: {
              group: {
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
                  createdAt: true,
                },
              },
            },
          },
        },
      });
      return response.groups;
    } catch (error) {
      console.error("Error in User.group(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to fetch user by ID.");
    }
  }

  static async balance(id) {
    try {
      const balance = await db.user.findFirst({
        where: { id },
        select: {
          debtor: {
            where: { confirmed: false }, // only pending splits
            select: {
              creditor: {
                select: { id: true, name: true, pfp: true, upi: true },
              },
              amount: true,
            },
          },
          creditor: {
            where: { confirmed: false }, // only pending splits
            select: {
              debtor: {
                select: { id: true, name: true, pfp: true, upi: true },
              },
              amount: true,
            },
          },
        },
      });
      return balance;
    } catch (error) {
      console.error("Error in User.balance(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to fetch balance.");
    }
  }

  static async putUpi(userId, upi) {
    try {
      await db.user.update({
        where: { id: userId },
        data: { upi },
      });
    } catch (err) {
      console.error("Error in User.putUpi(): ", err.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to update UPI");
    }
  }

  static async getUpi(userId) {
    try {
      return await db.user.findFirst({
        where: { id: userId },
        select: { upi: true },
      });
    } catch (err) {
      console.error("Error in User.getUpi(): ", err.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to fetch UPI");
    }
  }

  static async delete(clerkUser) {
    try {
      await db.user.delete({
        where: { id: clerkUser.id },
      });
    } catch (error) {
      console.error("Error in User.delete(): ", error.message);
      console.error(error.stack);
      throw new Error(error.message || "Failed to delete user.");
    }
  }
}

module.exports = User;
