"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
class Split {
    static async create(name, groupId, debtorId, creditorId, amount) {
        try {
            await prismaClient_1.default.split.create({
                data: {
                    name,
                    groupId,
                    debtorId,
                    creditorId,
                    amount,
                },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in Split.create(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to create split.");
            }
        }
    }
    static async createMany(splits) {
        try {
            const totalSplits = await prismaClient_1.default.split.createManyAndReturn({
                data: splits,
            });
            if (!totalSplits)
                throw new Error("Unable to create splits for expense.");
            return totalSplits;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in Split.createMany(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to create multiple splits.");
            }
        }
    }
    static async get(id) {
        try {
            const split = await prismaClient_1.default.split.findUnique({
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
            if (!split)
                throw new Error("Unable to fetch split.");
            return split;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in Split.get(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to fetch split.");
            }
        }
    }
    static async delete(id) {
        try {
            await prismaClient_1.default.split.delete({
                where: { id },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in Split.delete(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to delete split.");
            }
        }
    }
    static async deleteAll(grpId) {
        try {
            await prismaClient_1.default.split.deleteMany({
                where: {
                    AND: [
                        { groupId: Number(grpId) },
                        { confirmed: false },
                        { settled: false },
                    ],
                },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in Split.deleteAll(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message ||
                    "Failed to delete all unsettled splits for the group.");
            }
        }
    }
}
exports.default = Split;
//# sourceMappingURL=Split.js.map