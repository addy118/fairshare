const Expense = require("../prisma/queries/Expense");
const { createBalance, calculateSplits } = require("./split");

exports.postExp = async (req, res) => {
  const expense = req.body;

  const balance = createBalance(req.body);
  const { splits, tolerance } = calculateSplits(balance);

  // to send it to db query postExpense()
  const payers = expense.payers.map((payer) => {
    return { payerId: payer.payerId, paidAmt: payer.amount };
  });

  const splitsArr = splits.map((split) => {
    return {
      name: expense.name,
      debitorId: Number(split[0]),
      creditorId: Number(split[1]),
      amount: Number(split[2]),
      groupId: expense.groupId,
    };
  });

  // console.log("Expense: ", expense);
  // console.log("Payers: ", payers);
  // console.log("Splits: ", splitsArr);
  const exp = await Expense.create(expense, payers, splitsArr);

  res.json({ exp });
};

exports.getExp = async (req, res) => {
  const { expId } = req.params;
  // console.log(expId);
  const exp = await Expense.get(Number(expId));
  res.json({ exp });
};

exports.settleSplit = async (req, res) => {
  const { splitId } = req.params;

  await Expense.settle(Number(splitId));
  res.json({ msg: "success" });
};

const exp = {
  id: 14,
  name: "exp3",
  groupId: 1,
  totalAmt: 290,
  payers: [
    { payerId: 6, paidAmt: 60 },
    { payerId: 5, paidAmt: 100 },
    { payerId: 4, paidAmt: 80 },
    { payerId: 3, paidAmt: 40 },
    { payerId: 2, paidAmt: 10 },
  ],
  splits: [
    { debtorId: 3, creditorId: 6, amount: 2, settled: false },
    { debtorId: 3, creditorId: 4, amount: 16, settled: false },
    { debtorId: 2, creditorId: 4, amount: 6, settled: false },
    { debtorId: 2, creditorId: 5, amount: 42, settled: false },
  ],
};
