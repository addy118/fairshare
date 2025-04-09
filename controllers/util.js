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

  balanceArr.forEach((split) => {
    if (split.payerId) {
      balance[split.payerId] = split.amount;
    }
  });
  return balance;
}

function getExpBalance(expenses) {
  // const expenses = [
  //   {
  //     id: 18,
  //     name: "exp1",
  //     totalAmt: 250,
  //     payers: [
  //       {
  //         payerId: 4,
  //         paidAmt: 50,
  //       },
  //       {
  //         payerId: 3,
  //         paidAmt: 0,
  //       },
  //     ],
  //     createdAt: "2025-04-03T16:24:26.336Z",
  //   },
  // ];

  const expBalance = {};

  expenses.forEach((expense) => {
    let totalAmt = expense.totalAmt;
    let payers = expense.payers;
    let numPayers = payers.length;
    let share = Math.floor(totalAmt / numPayers);

    payers.forEach((payer) => {
      let payerId = payer.payerId;
      let paidAmt = payer.paidAmt;

      // initialize default key value
      if (!(payerId in expBalance)) {
        expBalance[payerId] = 0;
      }

      expBalance[payerId] -= share;
      expBalance[payerId] += paidAmt;
    });
  });

  return expBalance;
}

function getSplitBalance(splits) {
  // creates a balance graph for a given splits array
  // splits = [
  //   { debtor: { id: 3, name: "" }, creditorId: { id: 2, name: "" }, amount: 43 },
  // ];

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
  // creates a minimal splits array from the given balance graph
  // balance = { "3": -48, "4": 22, "5": -18, "6": 42, "7": 2 }

  // Step 1: Separate positive (creditors) and negative (debtors) balances
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

  return splits;
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
  getExpBalance,
  getSplitBalance,
  calcTolerance,
  mergeChrono,
};

// const timeline = [
//   {
//     name: "exp3",
//     totalAmt: 290,
//     createdAt: "2025-04-04T17:17:05.369Z",
//     payers: [
//       {
//         payerId: 6,
//         paidAmt: 60,
//       },
//       {
//         payerId: 5,
//         paidAmt: 100,
//       },
//       {
//         payerId: 4,
//         paidAmt: 80,
//       },
//       {
//         payerId: 3,
//         paidAmt: 40,
//       },
//       {
//         payerId: 2,
//         paidAmt: 10,
//       },
//     ],
//     type: "expense",
//     timestamp: "2025-04-04T17:17:05.369Z",
//     balance: {
//       2: -48,
//       3: -18,
//       4: 22,
//       5: 42,
//       6: 2,
//     },
//   },
//   {
//     name: "exp1",
//     totalAmt: 250,
//     createdAt: "2025-04-07T10:45:50.295Z",
//     payers: [
//       {
//         payerId: 4,
//         paidAmt: 50,
//       },
//       {
//         payerId: 3,
//         paidAmt: 0,
//       },
//       {
//         payerId: 2,
//         paidAmt: 200,
//       },
//     ],
//     type: "expense",
//     timestamp: "2025-04-07T10:45:50.295Z",
//     balance: {
//       2: 69,
//       3: -101,
//       4: -11,
//       5: 42,
//       6: 2,
//     },
//   },
//   {
//     name: "exp2",
//     totalAmt: 50,
//     createdAt: "2025-04-07T10:46:14.075Z",
//     payers: [
//       {
//         payerId: 3,
//         paidAmt: 50,
//       },
//       {
//         payerId: 2,
//         paidAmt: 0,
//       },
//     ],
//     type: "expense",
//     timestamp: "2025-04-07T10:46:14.075Z",
//     balance: {
//       2: 44,
//       3: -76,
//       4: -11,
//       5: 42,
//       6: 2,
//     },
//   },
//   {
//     name: "exp4",
//     totalAmt: 60,
//     createdAt: "2025-04-07T10:46:23.475Z",
//     payers: [
//       {
//         payerId: 6,
//         paidAmt: 10,
//       },
//       {
//         payerId: 4,
//         paidAmt: 20,
//       },
//       {
//         payerId: 3,
//         paidAmt: 30,
//       },
//     ],
//     type: "expense",
//     timestamp: "2025-04-07T10:46:23.475Z",
//     balance: {
//       2: 44,
//       3: -66,
//       4: -11,
//       5: 42,
//       6: -8,
//     },
//   },
//   {
//     debtorId: 6,
//     creditorId: 5,
//     amount: 8,
//     updatedAt: "2025-04-07T13:54:19.103Z",
//     name: "Optimized Split",
//     type: "split",
//     timestamp: "2025-04-07T13:54:19.103Z",
//     balance: {
//       2: 44,
//       3: -66,
//       4: -11,
//       5: 34,
//       6: 0,
//     },
//   },
// ];
