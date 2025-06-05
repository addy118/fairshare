"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putUserUpi = exports.getUserUpi = exports.getUserGroups = exports.getUserBal = exports.getUserInfo = exports.getUser = exports.testProtected = exports.test = void 0;
const User_1 = __importDefault(require("../queries/User"));
const test = async (req, res) => {
    const { data } = req.body;
    try {
        const user = await User_1.default.get(data);
        if (!user)
            throw new Error("No user found");
        res.status(200).json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in test():", error.message);
            console.error(error.stack);
            res.status(400).json({ message: error.message || "Failed to test." });
        }
    }
};
exports.test = test;
const testProtected = async (req, res) => {
    const { userId } = req.params;
    if (!userId)
        throw new Error("Unable to fetch userId.");
    try {
        const user = await User_1.default.getById(userId);
        if (!user)
            throw new Error("No user found");
        res.status(200).json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in testProtecte()d:", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to test protected route." });
        }
    }
};
exports.testProtected = testProtected;
const getUser = async (req, res) => {
    const { userId } = req.params;
    try {
        if (!userId)
            throw new Error("Unable to fetch user ID.");
        const user = await User_1.default.getById(userId);
        if (!user)
            throw new Error("No user found");
        res.status(200).json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in getUse()r:", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to fetch user." });
        }
    }
};
exports.getUser = getUser;
const getUserInfo = async (req, res) => {
    const { userId } = req.params;
    if (!userId)
        throw new Error("Unable to fetch userId.");
    try {
        const user = await User_1.default.getBasicInfo(userId);
        if (!user)
            throw new Error("No user found");
        res.status(200).json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in getUserInf()o:", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to fetch user info." });
        }
    }
};
exports.getUserInfo = getUserInfo;
const getUserBal = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId)
            throw new Error("Unable to fetch userId.");
        const balance = await User_1.default.balance(userId);
        if (!balance)
            throw new Error("Unable to fetch balance.");
        const mergedDebtor = {};
        balance.debtor.forEach((item) => {
            const id = item.creditor.id;
            if (mergedDebtor[id]) {
                mergedDebtor[id].amount += item.amount;
            }
            else {
                mergedDebtor[id] = { ...item };
            }
        });
        const mergedCreditor = {};
        balance.creditor.forEach((item) => {
            const id = item.debtor.id;
            if (mergedCreditor[id]) {
                mergedCreditor[id].amount += item.amount;
            }
            else {
                mergedCreditor[id] = { ...item };
            }
        });
        res.json({
            debtor: Object.values(mergedDebtor),
            creditor: Object.values(mergedCreditor),
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in getUserBa()l:", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to retrieve user balance" });
        }
    }
};
exports.getUserBal = getUserBal;
const getUserGroups = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId)
            throw new Error("Unable to fetch userId.");
        const response = await User_1.default.groups(userId);
        if (!response)
            throw new Error("Unable to fetch user groups.");
        res.status(200).json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in getUserGroup()s:", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to retrieve user groups" });
        }
    }
};
exports.getUserGroups = getUserGroups;
const getUserUpi = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId)
            throw new Error("Unable to fetch userId.");
        const upi = await User_1.default.getUpi(userId);
        if (!upi)
            throw new Error("Unable to fetch user's UPI.");
        res.status(200).json(upi);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in getUserUpi(): ", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to fetch the user's UPI" });
        }
    }
};
exports.getUserUpi = getUserUpi;
const putUserUpi = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId)
            throw new Error("Unable to fetch userId.");
        const { upi } = req.body;
        if (!upi)
            throw new Error("Unable to fetch upi.");
        await User_1.default.putUpi(userId, upi);
        res.status(200).json({ message: "User UPI updated successfully!" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in putUserUpi(): ", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to update the user's UPI" });
        }
    }
};
exports.putUserUpi = putUserUpi;
//# sourceMappingURL=user.controller.js.map