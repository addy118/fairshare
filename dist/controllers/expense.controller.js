"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remind = exports.notConfirmSplit = exports.confirmSplit = exports.settleSplit = exports.getExp = exports.postExp = void 0;
const nodeMailer_1 = require("../config/nodeMailer");
const Expense_1 = __importDefault(require("../queries/Expense"));
const Split_1 = __importDefault(require("../queries/Split"));
const util_1 = require("./util");
const postExp = async (req, res) => {
    try {
        const expense = req.body;
        const balance = (0, util_1.createBalance)(expense);
        const splits = (0, util_1.calculateSplits)(balance);
        const payers = expense.payers.map((payer) => ({
            payerId: payer.payerId,
            paidAmt: payer.amount,
        }));
        const splitsArr = splits.map((split) => ({
            name: expense.name,
            debtorId: split[0],
            creditorId: split[1],
            amount: Number(split[2]),
            groupId: expense.groupId,
        }));
        const exp = await Expense_1.default.create(expense, payers, splitsArr);
        if (!exp)
            throw new Error("Unable to create expense.");
        res.json({ exp });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in postExp(): ", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to create expense." });
        }
    }
};
exports.postExp = postExp;
const getExp = async (req, res) => {
    try {
        const { expId } = req.params;
        const exp = await Expense_1.default.get(Number(expId));
        if (!exp)
            throw new Error("Unable to fetch expense.");
        res.json({ exp });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in getExp(): ", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to retrieve expense" });
        }
    }
};
exports.getExp = getExp;
const settleSplit = async (req, res) => {
    try {
        const { splitId } = req.params;
        await Expense_1.default.settle(Number(splitId));
        res.json({ message: "success" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in settleSplit(): ", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to settle split" });
        }
    }
};
exports.settleSplit = settleSplit;
const confirmSplit = async (req, res) => {
    try {
        const { splitId } = req.params;
        await Expense_1.default.confirm(Number(splitId));
        res.json({ message: "success" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in confirmSplit(): ", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to confirm split" });
        }
    }
};
exports.confirmSplit = confirmSplit;
const notConfirmSplit = async (req, res) => {
    try {
        const { splitId } = req.params;
        await Expense_1.default.notConfirm(Number(splitId));
        res.json({ message: "success" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in notConfirmSplit(): ", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Failed to not confirm split" });
        }
    }
};
exports.notConfirmSplit = notConfirmSplit;
const remind = async (req, res) => {
    const { splitId } = req.params;
    const split = await Split_1.default.get(Number(splitId));
    if (!split)
        throw new Error("Unable to fetch split.");
    const to = split.creditor;
    const from = split.debtor;
    if (!from || !from.email)
        throw new Error("Failed to fetch debtor's email.");
    const mailOptions = {
        from: "addyyy118@gmail.com",
        to: from.email,
        subject: "Payment Reminder",
        html: `
    <p>Hi <strong>${from.name}</strong>!</p>
    <p>You need to pay <strong>₹${split.amount}</strong> to <strong>${to.name}</strong>.</p>
    <p>Thanks,<br/>Fairshare Team</p>
    `,
    };
    nodeMailer_1.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            res
                .status(400)
                .json({ message: error.message || "Error sending reminder mail." });
        }
        else {
            console.log("Email sent:", info.response);
            res
                .status(200)
                .json({ message: "Reminder email was sent successfully!" });
        }
    });
};
exports.remind = remind;
//# sourceMappingURL=expense.controller.js.map