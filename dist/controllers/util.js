"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBalance = createBalance;
exports.calculateSplits = calculateSplits;
exports.getGroupBalance = getGroupBalance;
exports.getSplitBalance = getSplitBalance;
exports.mergeChrono = mergeChrono;
const Group_1 = __importDefault(require("../queries/Group"));
function createBalance(expense) {
    const balance = {};
    const share = Math.floor(expense.totalAmt / expense.payers.length);
    const balanceArr = expense.payers.map((payer) => ({
        ...payer,
        amount: payer.amount - share,
    }));
    balanceArr.forEach((split) => {
        if (split.payerId) {
            balance[split.payerId] = split.amount;
        }
    });
    return balance;
}
async function getGroupBalance(groupId, isOptimizing = false) {
    const members = await Group_1.default.members(groupId);
    if (!members)
        throw new Error("Members not found.");
    const groupTrans = await Group_1.default.expenses(Number(groupId));
    if (!groupTrans)
        throw new Error("Unable to retrieve group transactions.");
    const { expenses, splits } = groupTrans;
    let settledSplits = splits.filter((split) => split.confirmed || split.settled);
    if (!isOptimizing) {
        settledSplits = splits.filter((split) => split.confirmed);
    }
    let balance = {};
    members.forEach((mem) => (balance[mem.member.id] = 0));
    expenses.forEach((expense) => {
        const share = Math.floor(expense.totalAmt / expense.payers.length);
        expense.payers.forEach((payer) => {
            balance[payer.payer.id] += payer.paidAmt - share;
        });
    });
    settledSplits.forEach((split) => {
        if (isOptimizing) {
            if (split.confirmed || split.settled) {
                balance[split.debtor.id] += split.amount;
                balance[split.creditor.id] -= split.amount;
            }
        }
        else {
            if (split.confirmed) {
                balance[split.debtor.id] += split.amount;
                balance[split.creditor.id] -= split.amount;
            }
        }
    });
    return balance;
}
function getSplitBalance(splits) {
    const balance = {};
    splits.forEach((split) => {
        if (!balance[split.debtor.id])
            balance[split.debtor.id] = 0;
        balance[split.debtor.id] -= split.amount;
        if (!balance[split.creditor.id])
            balance[split.creditor.id] = 0;
        balance[split.creditor.id] += split.amount;
    });
    return balance;
}
function calculateSplits(balance) {
    const creditors = [];
    const debtors = [];
    for (const [person, amount] of Object.entries(balance)) {
        const roundedAmount = Math.round(amount * 100) / 100;
        if (amount > 0) {
            creditors.push({ name: person, amount: roundedAmount });
        }
        else if (amount < 0) {
            debtors.push({ name: person, amount: -roundedAmount });
        }
    }
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);
    const splits = [];
    let i = 0;
    let j = 0;
    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        if (!debtor || !creditor)
            throw new Error("Undefined debtor or creditor.");
        const transferAmount = Math.min(debtor.amount, creditor.amount);
        if (transferAmount > 0) {
            const roundedTransfer = Math.round(transferAmount * 100) / 100;
            splits.push([debtor.name, creditor.name, roundedTransfer]);
        }
        debtor.amount -= transferAmount;
        creditor.amount -= transferAmount;
        if (debtor.amount < 0.01)
            i++;
        if (creditor.amount < 0.01)
            j++;
    }
    return splits;
}
function mergeChrono(expenses, splits) {
    const expEntries = expenses.map((expense) => ({
        type: "expense",
        timestamp: expense.createdAt,
        ...expense,
    }));
    const splitEntries = splits.map((split) => ({
        type: "split",
        timestamp: split.updatedAt,
        ...split,
    }));
    return [...expEntries, ...splitEntries].sort((a, b) => {
        if (a.timestamp && b.timestamp)
            return a.timestamp.getTime() - b.timestamp.getTime();
        return 0;
    });
}
//# sourceMappingURL=util.js.map