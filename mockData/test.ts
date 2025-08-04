import { expenses } from "./expenses";
import { AdjList, Participant, RawExpense, SplitStd } from "types";
import { createBalance } from "../controllers/util";
import { splits } from "./splits";

function calculateSplits(balance: Record<string, number>): AdjList {
  // step 1: separate positive (creditors) and negative (debtors) balances
  const creditors: Participant[] = [];
  const debtors: Participant[] = [];

  for (const [person, amount] of Object.entries(balance)) {
    // Handle floating point precision8999
    const roundedAmount = Math.round(amount * 100) / 100;

    if (amount > 0) {
      creditors.push({ name: person, amount: roundedAmount });
    } else if (amount < 0) {
      debtors.push({ name: person, amount: -roundedAmount }); // Convert to positive for ease of calculation
    }
  }

  // step 2: Sort both arrays by amount in descending order
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const splits: AdjList = [];

  // Greedy approach: match largest debtor with largest creditor first
  let i = 0; // Pointer for debtors
  let j = 0; // Pointer for creditors

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    if (!debtor || !creditor) throw new Error("Undefined debtor or creditor.");

    // Calculate the minimum of what is owed and what is to be received
    const transferAmount = Math.min(debtor.amount, creditor.amount);

    // Create a transaction
    if (transferAmount > 0) {
      const roundedTransfer = Math.round(transferAmount * 100) / 100;
      splits.push([debtor.name, creditor.name, roundedTransfer]);
    }

    // Update remaining balances
    debtor.amount -= transferAmount;
    creditor.amount -= transferAmount;

    // Move to next person if balance is settled
    if (debtor.amount < 0.01) i++; // Using small threshold for floating point comparison
    if (creditor.amount < 0.01) j++;
  }

  // console.log(splits);
  return splits;
}

function createExpense(expense: RawExpense | undefined): {
  balance: any;
  splits: AdjList;
} {
  if (!expense) {
    throw new Error("No expense found in expenses array.");
  }

  const balance = createBalance(expense);
  const splits = calculateSplits(balance);

  const payers = expense.payers.map((payer) => ({
    payerId: payer.payerId,
    paidAmt: payer.amount,
  }));

  const splitsArr: SplitStd[] = splits.map((split) => ({
    name: expense.name,
    debtorId: split[0],
    creditorId: split[1],
    amount: Number(split[2]),
    groupId: expense.groupId,
  }));

  // console.log(payers);
  // console.log(splits);
  return { balance, splits };
}

function getGroupBalance(isOptimizing: boolean = false): any {
  // get all the group members
  const members = ["A", "B", "C", "D", "E"];

  // get all the group expenses and splits
  // imported from ./mockData/splits.ts & ./mockData/expenses.ts

  // filter the splits that needs to be optimized
  // consider the settled splits also as done as they might have been really sent by the user
  let settledSplits = splits.filter(
    (split) => split.confirmed || split.settled
  );

  // only select the confirmed splits for actual balance display
  if (!isOptimizing) {
    settledSplits = splits.filter((split) => split.confirmed);
  }

  // console.log("Settle Splits: ", settledSplits);

  let balance: any = {};
  members.forEach((id: string) => (balance[id] = 0));

  // processing expenses
  expenses.forEach((expense) => {
    const share = Math.floor(expense.totalAmt / expense.payers.length);
    expense.payers.forEach((payer) => {
      balance[payer.payerId] += payer.amount - share;
    });
  });

  // processing splits
  settledSplits.forEach((split) => {
    // include the settled splits as done when optimizing splits to prevent money loss
    if (isOptimizing) {
      if (split.confirmed || split.settled) {
        // IMPORTANT: amounts are always positive
        // NOTE: BEWARE OF +VE/-VE SIGNS
        balance[split.debtor] += split.amount;
        balance[split.creditor] -= split.amount;
      }
    } else {
      if (split.confirmed) {
        balance[split.debtor] += split.amount;
        balance[split.creditor] -= split.amount;
      }
    }
  });

  // console.log(balance);
  return balance;
}

// create each expense and check output
const initSpits: AdjList = [];
for (let i = 0; i < expenses.length; i++) {
  const { balance, splits: expSplits } = createExpense(expenses[i]);
  console.log("expense ", i + 1);
  console.log(balance);
  console.log(expSplits);
  expSplits.forEach((split) => initSpits.push(split));
}

console.log("init");
console.log(initSpits);

function optimizeSplits(): { totalBal: any; optiSplits: AdjList } {
  const totalBal = getGroupBalance(true);
  const optiSplits = calculateSplits(totalBal);
  return { totalBal, optiSplits };
}

console.log("optimized");
const { totalBal, optiSplits } = optimizeSplits();
console.log(totalBal);
console.log(optiSplits);

console.log(
  "Optimization Percentage: ",
  ((initSpits.length - optiSplits.length) / initSpits.length) * 100
);
