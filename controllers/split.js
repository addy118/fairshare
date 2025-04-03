const { exp3, expenses, splits } = require("./expenses");

function createBalance(expense) {
  // creates a balance graph for a given raw expense (db data)
  // expense = {
  //   name: "expense",
  //   groupId: 1,
  //   totalAmt: 50,
  //   payers: [
  //     { name: "A", payerId: 2, amount: 0 },
  //     { name: "B", payerId: 3, amount: 50 },
  //   ],
  // }

  const balance = {};
  const share = Math.floor(expense.totalAmt / expense.payers.length);

  const balanceArr = expense.payers.map((payer) => ({
    ...payer,
    amount: payer.amount - share,
  }));

  balanceArr.forEach((split) => (balance[split.name] = split.amount));
  return balance;
}

function getBalance(splits) {
  // creates a balance graph for a given splits array
  // splits = [["A", "C", 4], ["A", "E", 2]]
  const balance = {};

  for (const [debtor, creditor, amount] of splits) {
    if (!balance[debtor]) balance[debtor] = 0;
    balance[debtor] -= amount;

    if (!balance[creditor]) balance[creditor] = 0;
    balance[creditor] += amount;
  }

  return balance;
}

function calculateSplits(balance) {
  // creates a minimal splits array from the given balance graph
  // balance = { "A": -48, "B": 22, "C": -18, "D": 42, "E": 2 }

  // Step 1: Separate positive (creditors) and negative (debtors) balances
  const creditors = [];
  const debtors = [];

  for (const [person, amount] of Object.entries(balance)) {
    // Handle floating point precision
    const roundedAmount = Math.round(amount * 100) / 100;

    if (amount > 0) {
      creditors.push({ name: person, amount });
    } else if (amount < 0) {
      debtors.push({ name: person, amount: -amount }); // Convert to positive for ease of calculation
    }
  }

  // Step 2: Sort both arrays by amount in descending order
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

  const newBalance = getBalance(splits);
  const tolerance = calcTolerance(balance, newBalance);
  return { splits, tolerance };
}

function getAllSplits(expenses) {
  // creates an overall redundant splits array from the array of all the raw expenses (db data)
  // expense = {
  //   name: "expense",
  //   groupId: 1,
  //   totalAmt: 50,
  //   payers: [
  //     { name: "A", payerId: 2, amount: 0 },
  //     { name: "B", payerId: 3, amount: 50 },
  //   ],
  // }

  let totalSplits = [];
  let totalTolerance = {};
  expenses.forEach((expense, i) => {
    const balance = createBalance(expense);
    // console.log("Expense", i + 1, "->", balance);
    const { splits, tolerance } = calculateSplits(balance);

    for (const [person, value] of Object.entries(tolerance)) {
      if (!totalTolerance[person]) totalTolerance[person] = 0;
      totalTolerance[person] += value;
    }
    // console.log("Tolerance after expense: ", i + 1, totalTolerance);

    totalSplits = [...totalSplits, ...splits];
  });

  return { totalSplits, totalTolerance };
}

function calcTolerance(before, after) {
  // const before = { A: 117, B: -83, C: -33 };
  // const after = { A: 116, B: -83, C: -33 };
  const tolerance = {};

  for (const key of Object.keys(before)) {
    if (after[key] === undefined) continue;

    const currTolerance = after[key] - before[key];
    if (currTolerance != 0) {
      tolerance[key] = currTolerance;
    }
  }

  return tolerance;
}

function minimizeCashFlow(splits) {
  // calculates the minimized splits array from the redundant splits array
  // splits = [["A", "C", 4], ["A", "E", 2]]

  // Step 1: Calculate net balances for each person
  const overall = getBalance(splits);
  const { splits: transactions, tolerance } = calculateSplits(overall);

  return { transactions, tolerance };
}

const { totalSplits, totalTolerance } = getAllSplits(expenses);
console.log(totalTolerance);
const { transactions, tolerance } = minimizeCashFlow(totalSplits);
console.log("Minimized Transactions: ", transactions);
