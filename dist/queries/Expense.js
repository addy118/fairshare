"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const library_1 = require("@prisma/client/runtime/library");
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const Group_1 = __importDefault(require("./Group"));
class Expense {
    static async create(exp, payersArr, splitsArr) {
        try {
            for (const payer of payersArr) {
                const isMember = await Group_1.default.isMember(payer.payerId, Number(exp.groupId));
                if (!isMember) {
                    throw new Error(`User with ID ${payer.payerId} is not a member of the group with ID ${exp.groupId}`);
                }
            }
            const res = await prismaClient_1.default.expense.create({
                data: {
                    name: exp.name,
                    totalAmt: Number(exp.totalAmt),
                    mainGroup: { connect: { id: Number(exp.groupId) } },
                    payers: {
                        create: payersArr.map((payer) => ({
                            paidAmt: payer.paidAmt,
                            payer: { connect: { id: payer.payerId } },
                        })),
                    },
                    splits: {
                        create: splitsArr.map((split) => ({
                            name: exp.name,
                            amount: split.amount,
                            mainGroup: { connect: { id: Number(exp.groupId) } },
                            debtor: { connect: { id: split.debtorId } },
                            creditor: { connect: { id: split.creditorId } },
                        })),
                    },
                },
            });
            return res;
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError &&
                error.code === "P2002")
                throw new Error("A single participant can't pay multiple times for a single expense.");
            if (error instanceof Error) {
                console.error("Error in Expense.create(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to create expense.");
            }
        }
    }
    static async get(id) {
        try {
            const res = await prismaClient_1.default.expense.findFirst({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    mainGroup: { select: { id: true, name: true } },
                    totalAmt: true,
                    payers: {
                        select: {
                            payer: {
                                select: {
                                    id: true,
                                    name: true,
                                    username: true,
                                    pfp: true,
                                    upi: true,
                                },
                            },
                            paidAmt: true,
                        },
                    },
                    splits: {
                        select: {
                            debtor: {
                                select: {
                                    id: true,
                                    name: true,
                                    username: true,
                                    pfp: true,
                                    upi: true,
                                },
                            },
                            creditor: {
                                select: {
                                    id: true,
                                    name: true,
                                    username: true,
                                    pfp: true,
                                    upi: true,
                                },
                            },
                            amount: true,
                            settled: true,
                            confirmed: true,
                        },
                    },
                    _count: { select: { payers: true, splits: true } },
                },
            });
            if (!res)
                throw new Error("Unable to fetch expense.");
            return res;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in Expense.get(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to fetch expense details.");
            }
        }
    }
    static async settle(id) {
        try {
            await prismaClient_1.default.split.update({
                where: { id },
                data: { settled: true },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in Expense.settle(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to settle split.");
            }
        }
    }
    static async confirm(id) {
        try {
            await prismaClient_1.default.split.update({
                where: { id },
                data: { settled: true, confirmed: true },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in Expense.confirm(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to confirm split.");
            }
        }
    }
    static async notConfirm(id) {
        try {
            await prismaClient_1.default.split.update({
                where: { id },
                data: { settled: false, confirmed: false },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in Expense.notConfirm(): ", error.message);
                console.error(error.stack);
                throw new Error(error.message || "Failed to confirm split.");
            }
        }
    }
}
exports.default = Expense;
//# sourceMappingURL=Expense.js.map