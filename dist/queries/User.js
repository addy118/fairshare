"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const library_1 = require("@prisma/client/runtime/library");
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
class User {
    static async create(clerkUser) {
        try {
            return await prismaClient_1.default.user.create({
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
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError &&
                error.code === "P2002") {
                throw new Error(error.message || "A user with this email or username already exists.");
            }
            if (error instanceof Error) {
                console.error("Error in User.create(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to create user.");
            }
        }
    }
    static async update(clerkUser) {
        try {
            return await prismaClient_1.default.user.update({
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
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError &&
                error.code === "P2002") {
                throw new Error(error.message || "A user with this email or username already exists.");
            }
            if (error instanceof Error) {
                console.error("Error in User.update(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to create user.");
            }
        }
    }
    static async delete(clerkUser) {
        try {
            await prismaClient_1.default.user.delete({
                where: { id: clerkUser.id },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in User.delete(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to delete user.");
            }
        }
    }
    static async getBasicInfo(id) {
        try {
            const user = await prismaClient_1.default.user.findUnique({
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
            if (!user)
                throw new Error("Unable to fetch user.");
            return user;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in User.getBasicInfo(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to fetch user info.");
            }
        }
    }
    static async get(data) {
        try {
            const user = await prismaClient_1.default.user.findFirst({
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
            if (!user)
                throw new Error("Unable to find user.");
            return user;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in User.get(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to fetch user by email/username.");
            }
        }
    }
    static async getNameById(id) {
        try {
            const user = await prismaClient_1.default.user.findUnique({
                where: { id },
                select: { name: true },
            });
            if (!user || !user.name)
                throw new Error("Unable to fetch user's name.");
            return user.name;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in User.getNameById(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to fetch name by ID.");
            }
        }
    }
    static async getPfpById(id) {
        try {
            const user = await prismaClient_1.default.user.findUnique({
                where: { id },
                select: { pfp: true },
            });
            if (!user || !user.pfp)
                throw new Error("Unable to fetch user's pfp.");
            return user.pfp;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in User.getPfpById(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to fetch pfp by ID.");
            }
        }
    }
    static async getIdbyUserName(username) {
        try {
            const userId = await prismaClient_1.default.user.findFirst({
                where: { username },
                select: { id: true },
            });
            if (!userId) {
                throw new Error("No user found with the given username.");
            }
            return userId.id;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in getIdbyUserName(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to fetch ID by username.");
            }
        }
    }
    static async getById(id) {
        try {
            const user = await prismaClient_1.default.user.findUnique({
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
            if (!user)
                throw new Error("Unable to fetch user.");
            return user;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in User.getById(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to fetch user by ID.");
            }
        }
    }
    static async groups(id) {
        try {
            const response = await prismaClient_1.default.user.findUnique({
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
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in User.group(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to fetch user by ID.");
            }
        }
    }
    static async balance(id) {
        try {
            const balance = await prismaClient_1.default.user.findFirst({
                where: { id },
                select: {
                    debtor: {
                        where: { confirmed: false },
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
                        where: { confirmed: false },
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
            if (!balance)
                throw new Error("Unable to fetch user's balance.");
            return balance;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in User.balance(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to fetch balance.");
            }
        }
    }
    static async getUpi(userId) {
        try {
            const user = await prismaClient_1.default.user.findFirst({
                where: { id: userId },
                select: { upi: true },
            });
            if (!user)
                throw new Error("Unable to fetch user.");
            return user;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in User.getUpi(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to fetch UPI");
            }
        }
    }
    static async putUpi(userId, upi) {
        try {
            await prismaClient_1.default.user.update({
                where: { id: userId },
                data: { upi },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in User.putUpi(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to update UPI");
            }
        }
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map