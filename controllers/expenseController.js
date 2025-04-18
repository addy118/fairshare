const transporter = require("../config/nodeMailer");
const Expense = require("../prisma/queries/Expense");
const Split = require("../prisma/queries/Split");
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

exports.confirmSplit = async (req, res) => {
  try {
    const { splitId } = req.params;
    await Expense.confirm(Number(splitId));
    res.json({ msg: "success" });
  } catch (err) {
    console.error("ERROR in confirmSplit:", err);
    res.status(500).json({ msg: "Failed to confirm split" });
  }
};

exports.notConfirmSplit = async (req, res) => {
  try {
    const { splitId } = req.params;
    await Expense.notConfirm(Number(splitId));
    res.json({ msg: "success" });
  } catch (err) {
    console.error("ERROR in notConfirmSplit:", err);
    res.status(500).json({ msg: "Failed to not confirm split" });
  }
};

exports.remind = async (req, res) => {
  const { splitId } = req.params;
  const split = Split.get(Number(splitId));
  const to = split.creditor;
  const from = split.debtor;

  const mailOptions = {
    from: "addyyy118@gmail.com",
    to: from.email,
    subject: "Payment Reminder",
    html: `<p>Hi <strong>${from.name}</strong>!</p>
    <p>You need to pay <strong>₹${split.amount}</strong> to <strong>${to.name}</strong>.</p>
    <p>Thanks,<br/>FairShare Team</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ msg: "Error sending reminder mail." });
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({ msg: "Reminder email was sent successfully!" });
    }
  });
};
