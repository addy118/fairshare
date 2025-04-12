const Expense = require("../prisma/queries/Expense");
const { createBalance, calculateSplits } = require("./util");

exports.postExp = async (req, res) => {
  try {
    console.log("Hit /exp/new");

    const expense = req.body;
    console.log("Request body:", expense);

    const balance = createBalance(expense);
    const splits = calculateSplits(balance);

    const payers = expense.payers.map((payer) => ({
      payerId: payer.payerId,
      paidAmt: payer.amount,
    }));

    const splitsArr = splits.map((split) => ({
      name: expense.name,
      debitorId: Number(split[0]),
      creditorId: Number(split[1]),
      amount: Number(split[2]),
      groupId: expense.groupId,
    }));

    const exp = await Expense.create(expense, payers, splitsArr);

    res.json({ exp });
  } catch (err) {
    console.error("ERROR in /exp/new:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.getExp = async (req, res) => {
  try {
    const { expId } = req.params;
    // console.log(expId);
    const exp = await Expense.get(Number(expId));
    res.json({ exp });
  } catch (err) {
    console.error("ERROR in getExp:", err);
    res.status(500).json({ msg: "Failed to retrieve expense" });
  }
};

exports.settleSplit = async (req, res) => {
  try {
    const { splitId } = req.params;
    await Expense.settle(Number(splitId));
    res.json({ msg: "success" });
  } catch (err) {
    console.error("ERROR in settleSplit:", err);
    res.status(500).json({ msg: "Failed to settle split" });
  }
};
