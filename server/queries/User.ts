import db from "../config/prismaClient";
import { LoginUser, UserBalance, UserDB, UserGroup, UserInfo } from "../types";
import { DeletedObjectJSON, UserJSON } from "@clerk/express";

class User {
  static async create(clerkUser: UserJSON): Promise<UserDB | undefined> {
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
  }

  static async update(clerkUser: UserJSON): Promise<UserDB | undefined> {
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
  }

  static async delete(clerkUser: DeletedObjectJSON): Promise<void> {
    await db.user.delete({ where: { id: clerkUser.id } });
  }

  static async getBasicInfo(id: string): Promise<UserInfo | undefined> {
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
  }

  static async get(data: string): Promise<LoginUser | undefined> {
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
  }

  static async getNameById(id: string): Promise<string | undefined> {
    const user = await db.user.findUnique({
      where: { id },
      select: { name: true },
    });

    if (!user || !user.name) throw new Error("Unable to fetch user's name.");
    return user.name;
  }

  static async getPfpById(id: string): Promise<string | undefined> {
    const user = await db.user.findUnique({
      where: { id },
      select: { pfp: true },
    });

    if (!user || !user.pfp) throw new Error("Unable to fetch user's pfp.");
    return user.pfp;
  }

  static async getIdbyUserName(username: string): Promise<string | undefined> {
    const userId = await db.user.findFirst({
      where: { username },
      select: { id: true },
    });

    if (!userId) {
      throw new Error("No user found with the given username.");
    }
    return userId.id;
  }

  static async getById(id: string): Promise<LoginUser | undefined> {
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
  }

  static async groups(id: string): Promise<UserGroup[] | undefined> {
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
  }

  static async balance(id: string): Promise<UserBalance | undefined> {
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
  }

  static async getUpi(
    userId: string
  ): Promise<{ upi: string | null } | undefined> {
    const user = await db.user.findFirst({
      where: { id: userId },
      select: { upi: true },
    });

    if (!user) throw new Error("Unable to fetch user.");
    return user;
  }

  static async putUpi(userId: string, upi: string): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: { upi },
    });
  }
}

export default User;
