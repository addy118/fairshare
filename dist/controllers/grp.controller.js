"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrpHistory = exports.getMinSplits = exports.getSplits = exports.getGrpBalance = exports.getAllExpenses = exports.getGrpInfo = exports.deleteMember = exports.postMember = exports.postDelGrp = exports.postGrp = void 0;
const Group_1 = __importDefault(require("../queries/Group"));
const Split_1 = __importDefault(require("../queries/Split"));
const User_1 = __importDefault(require("../queries/User"));
const util_1 = require("./util");
const postGrp = async (req, res) => {
    try {
        const { name } = req.body;
        const group = await Group_1.default.create(name);
        if (!group)
            throw new Error("Unable to fetch group");
        res.json({ message: "success", group });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in postGrp(): ", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to create group" });
        }
    }
};
exports.postGrp = postGrp;
const postDelGrp = async (req, res) => {
    try {
        const { groupId } = req.params;
        await Group_1.default.delete(Number(groupId));
        res.json({ message: "success" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in postDelGrp(): ", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to delete group" });
        }
    }
};
exports.postDelGrp = postDelGrp;
const postMember = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { username } = req.body;
        const userId = await User_1.default.getIdbyUserName(username);
        if (!userId)
            throw new Error("Can't find the user.");
        await Group_1.default.join(userId, Number(groupId));
        res.json({ message: "success" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in postMember(): ", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to add user to group." });
        }
    }
};
exports.postMember = postMember;
const deleteMember = async (req, res) => {
    try {
        const { groupId, memberId } = req.params;
        if (!memberId)
            throw new Error("Unable to fetch member ID.");
        if (!groupId)
            throw new Error("Unable to fetch group ID.");
        await Group_1.default.leave(memberId, Number(groupId));
        res.json({ message: "success" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in deleteMember(): ", error.message);
            console.error(error.stack);
            res.status(400).json({
                message: error.message || "Failed to remove member from group",
            });
        }
    }
};
exports.deleteMember = deleteMember;
const getGrpInfo = async (req, res) => {
    try {
        const { grpId } = req.params;
        const group = await Group_1.default.getById(Number(grpId));
        if (!group)
            throw new Error("Unable to fetch group");
        res.json(group);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in getGrpInfo(): ", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to retrieve group info" });
        }
    }
};
exports.getGrpInfo = getGrpInfo;
const getAllExpenses = async (req, res) => {
    try {
        const { grpId } = req.params;
        const group = await Group_1.default.expenses(Number(grpId));
        if (!group)
            throw new Error("Unable to fetch group");
        res.json(group);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in getAllExpenses(): ", error.message);
            console.error(error.stack);
            res.status(400).json({
                message: error.message || "Failed to retrieve group expenses",
            });
        }
    }
};
exports.getAllExpenses = getAllExpenses;
const getGrpBalance = async (req, res) => {
    try {
        const { grpId } = req.params;
        const rawBalance = await (0, util_1.getGroupBalance)(Number(grpId));
        const balance = await Promise.all(Object.entries(rawBalance).map(async ([userId, amount]) => ({
            user: {
                id: userId,
                name: await User_1.default.getNameById(userId),
            },
            amount: Number(amount),
        })));
        res.json(balance);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in getGrpBalance(): ", error.message);
            console.error(error.stack);
            res.status(400).json({
                message: error.message || "Failed to calculate group balance",
            });
        }
    }
};
exports.getGrpBalance = getGrpBalance;
const getSplits = async (req, res) => {
    try {
        const { grpId } = req.params;
        const splits = await Group_1.default.splits(Number(grpId));
        if (!splits)
            throw new Error("Unable to fetch splits");
        res.json(splits);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in getSplits(): ", error.message);
            console.error(error.stack);
            res.status(400).json({
                message: error.message || "Failed to retrieve splits information",
            });
        }
    }
};
exports.getSplits = getSplits;
const getMinSplits = async (req, res) => {
    try {
        const { grpId } = req.params;
        const balance = await (0, util_1.getGroupBalance)(Number(grpId), true);
        if (!balance)
            throw new Error("Unable to fetch balance.");
        const newSplits = (0, util_1.calculateSplits)(balance);
        const splitsArr = newSplits.map((split) => {
            return {
                name: "Optimized Split",
                groupId: Number(grpId),
                debtorId: split[0],
                creditorId: split[1],
                amount: Number(split[2]),
            };
        });
        await Split_1.default.deleteAll(Number(grpId));
        await Split_1.default.createMany(splitsArr);
        const minSplits = await Group_1.default.splits(Number(grpId));
        if (!minSplits)
            throw new Error("Unable to fetch minimum splits.");
        res.json(minSplits);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in getMinSplits(): ", error.message);
            console.error(error.stack);
            res.status(400).json({
                message: error.message || "Failed to calculate and update optimized splits",
            });
        }
    }
};
exports.getMinSplits = getMinSplits;
const getGrpHistory = async (req, res) => {
    try {
        const { groupId } = req.params;
        const members = await Group_1.default.members(Number(groupId));
        if (!members)
            throw new Error("Unable to fetch members.");
        const expenses = await Group_1.default.expenseHistory(Number(groupId));
        if (!expenses)
            throw new Error("Unable to fetch expenses.");
        const splits = await Group_1.default.splitsHistory(Number(groupId));
        if (!splits)
            throw new Error("Unable to fetch splits.");
        const timeline = (0, util_1.mergeChrono)(expenses, splits);
        const balance = {};
        members.forEach((mem) => (balance[mem.member.id] = 0));
        for (const entry of timeline) {
            if (entry.type == "expense") {
                const totalPeople = entry.payers.length;
                const share = Math.floor(entry.totalAmt / totalPeople);
                entry.payers.forEach(({ payer, paidAmt }) => {
                    balance[payer.id] += paidAmt - share;
                });
            }
            else if (entry.type == "split") {
                balance[entry.debtor.id] += entry.amount;
                balance[entry.creditor.id] -= entry.amount;
            }
            entry.balance = await Promise.all(Object.entries(balance).map(async ([userId, amount]) => ({
                user: {
                    id: userId,
                    name: await User_1.default.getNameById(userId),
                    pfp: await User_1.default.getPfpById(userId),
                },
                amount: Number(amount),
            })));
        }
        res.json(timeline);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in getGrpHistory(): ", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to retrieve group history" });
        }
    }
};
exports.getGrpHistory = getGrpHistory;
//# sourceMappingURL=grp.controller.js.map