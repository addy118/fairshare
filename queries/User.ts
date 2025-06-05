import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import db from "../config/prismaClient";
import { LoginUser, UserBalance, UserDB, UserGroup, UserInfo } from "../types";
import { DeletedObjectJSON, UserJSON } from "@clerk/express";

class User {
  static async create(clerkUser: UserJSON): Promise<UserDB | undefined> {
    try {
      return await db.user.create({
        data: {
          id: clerkUser.id,
          name: `${clerkUser.first_name} ${clerkUser.last_name}`,
          username: clerkUser.username,
          email: clerkUser.email_addresses[0]?.email_address ?? null,
          createdAt: new Date(clerkUser.created_at),
          updatedAt: new Date(clerkUser.updated_at),
          pfp: clerkUser.image_url,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        // handling unique constraint violation
        throw new Error(
          error.message || "A user with this email or username already exists."
        );
      }

      if (error instanceof Error) {
        console.error("Error in User.create(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to create user.");
      }
    }
  }

  static async update(clerkUser: UserJSON): Promise<UserDB | undefined> {
    try {
      return await db.user.update({
        where: { id: clerkUser.id },
        data: {
          name: `${clerkUser.first_name} ${clerkUser.last_name}`,
          username: clerkUser.username,
          email: clerkUser.email_addresses[0]?.email_address ?? null,
          updatedAt: new Date(clerkUser.updated_at),
          pfp: clerkUser.image_url,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        // handling unique constraint violation
        throw new Error(
          error.message || "A user with this email or username already exists."
        );
      }

      if (error instanceof Error) {
        console.error("Error in User.update(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to create user.");
      }
    }
  }

  static async delete(clerkUser: DeletedObjectJSON): Promise<void> {
    try {
      await db.user.delete({
        where: { id: clerkUser.id },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in User.delete(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to delete user.");
      }
    }
  }

  static async getBasicInfo(id: string): Promise<UserInfo | undefined> {
    try {
      const user = await db.user.findUnique({
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

      if (!user) throw new Error("Unable to fetch user.");
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in User.getBasicInfo(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to fetch user info.");
      }
    }
  }

  static async get(data: string): Promise<LoginUser | undefined> {
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
          createdAt: true,
          updatedAt: true,
          groups: {
            select: {
              group: {
                select: {
                  id: true,
                  name: true,
                  createdAt: true,
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
                },
              },
            },
          },
        },
      });

      if (!user) throw new Error("Unable to find user.");
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in User.get(): ", error.message);
        console.error(error.stack);
        throw new Error(
          error.message || "Failed to fetch user by email/username."
        );
      }
    }
  }

  static async getNameById(id: string): Promise<string | undefined> {
    try {
      const user = await db.user.findUnique({
        where: { id },
        select: { name: true },
      });

      if (!user || !user.name) throw new Error("Unable to fetch user's name.");
      return user.name;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in User.getNameById(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to fetch name by ID.");
      }
    }
  }

  static async getPfpById(id: string): Promise<string | undefined> {
    try {
      const user = await db.user.findUnique({
        where: { id },
        select: { pfp: true },
      });

      if (!user || !user.pfp) throw new Error("Unable to fetch user's pfp.");
      return user.pfp;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in User.getPfpById(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to fetch pfp by ID.");
      }
    }
  }

  static async getIdbyUserName(username: string): Promise<string | undefined> {
    try {
      const userId = await db.user.findFirst({
        where: { username },
        select: { id: true },
      });

      if (!userId) {
        throw new Error("No user found with the given username.");
      }
      return userId.id;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in getIdbyUserName(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to fetch ID by username.");
      }
    }
  }

  static async getById(id: string): Promise<LoginUser | undefined> {
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
          createdAt: true,
          updatedAt: true,
          groups: {
            select: {
              group: {
                select: {
                  id: true,
                  name: true,
                  createdAt: true,
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
                },
              },
            },
          },
        },
      });

      if (!user) throw new Error("Unable to fetch user.");
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in User.getById(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to fetch user by ID.");
      }
    }
  }

  static async groups(id: string): Promise<UserGroup[] | undefined> {
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
                  createdAt: true,
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
                },
              },
            },
          },
        },
      });

      if (!response || !response.groups)
        throw new Error("Unable to fetch user's groups.");
      return response.groups;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in User.group(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to fetch user by ID.");
      }
    }
  }

  static async balance(id: string): Promise<UserBalance | undefined> {
    try {
      const balance = await db.user.findFirst({
        where: { id },
        select: {
          debtor: {
            where: { confirmed: false }, // only pending splits
            select: {
              amount: true,
              creditor: {
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
          creditor: {
            where: { confirmed: false }, // only pending splits
            select: {
              amount: true,
              debtor: {
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
        },
      });

      if (!balance) throw new Error("Unable to fetch user's balance.");
      return balance;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in User.balance(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to fetch balance.");
      }
    }
  }

  static async getUpi(
    userId: string
  ): Promise<{ upi: string | null } | undefined> {
    try {
      const user = await db.user.findFirst({
        where: { id: userId },
        select: { upi: true },
      });

      if (!user) throw new Error("Unable to fetch user.");
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in User.getUpi(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to fetch UPI");
      }
    }
  }

  static async putUpi(userId: string, upi: string): Promise<void> {
    try {
      await db.user.update({
        where: { id: userId },
        data: { upi },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in User.putUpi(): ", error.message);
        console.error(error.stack);
        throw new Error(error.message || "Failed to update UPI");
      }
    }
  }
}

export default User;
