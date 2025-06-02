const Group = require("../prisma/queries/Group");

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
  // get all the group members
  const members = await Group.members(Number(groupId));

  // get all the group expenses and splits
  const { expenses, splits } = await Group.expenses(Number(groupId));

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

  let balance = {};
  members.forEach((mem) => (balance[mem.member.id] = 0));

  // processing expenses
  expenses.forEach((expense) => {
    const share = Math.floor(expense.totalAmt / expense.payers.length);
    expense.payers.forEach((payer) => {
      balance[payer.payer.id] += payer.paidAmt - share;
    });
  });

  // processing splits
  settledSplits.forEach((split) => {
    // include the settled splits as done when optimizing splits to prevent money loss
    if (isOptimizing) {
      if (split.confirmed || split.settled) {
        // IMPORTANT: amounts are always positive
        // NOTE: BEWARE OF +VE/-VE SIGNS
        balance[split.debtor.id] += split.amount;
        balance[split.creditor.id] -= split.amount;
      }
    } else {
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
    if (!balance[split.debtor.id]) balance[split.debtor.id] = 0;
    balance[split.debtor.id] -= split.amount;

    if (!balance[split.creditor.id]) balance[split.creditor.id] = 0;
    balance[split.creditor.id] += split.amount;
  });

  return balance;
}

function calculateSplits(balance) {
  // step 1: Separate positive (creditors) and negative (debtors) balances
  const creditors = [];
  const debtors = [];

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

  const splits = [];

  // Greedy approach: match largest debtor with largest creditor first
  let i = 0; // Pointer for debtors
  let j = 0; // Pointer for creditors

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

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

  return [...expEntries, ...splitEntries].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
}

module.exports = {
  createBalance,
  calculateSplits,
  getGroupBalance,
  getSplitBalance,
  mergeChrono,
};
