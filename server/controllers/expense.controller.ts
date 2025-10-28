import { transporter } from "../config/nodeMailer";
import Expense from "../queries/Expense";
import Split from "../queries/Split";
import { createBalance, calculateSplits } from "./util";
import { Controller, RawExpense, SplitStd } from "../types";
import { SendMailOptions, SentMessageInfo } from "nodemailer";
import { catchAsync } from "../middleware/catchAsync";

export const postExp: Controller = catchAsync(async (req, res) => {
  const expense: RawExpense = req.body;
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

  const exp = await Expense.create(expense, payers, splitsArr);
  if (!exp) throw new Error("Unable to create expense.");

  res.json({ exp });
});

export const getExp: Controller = catchAsync(async (req, res) => {
  const { expId } = req.params;
  const exp = await Expense.get(Number(expId));
  if (!exp) throw new Error("Unable to fetch expense.");
  res.json({ exp });
});

export const settleSplit: Controller = catchAsync(async (req, res) => {
  const { splitId } = req.params;
  await Expense.settle(Number(splitId));
  res.json({ message: "success" });
});

export const confirmSplit: Controller = catchAsync(async (req, res) => {
  const { splitId } = req.params;
  await Expense.confirm(Number(splitId));
  res.json({ message: "success" });
});

export const notConfirmSplit: Controller = catchAsync(async (req, res) => {
  const { splitId } = req.params;
  await Expense.notConfirm(Number(splitId));
  res.json({ message: "success" });
});

export const remind: Controller = catchAsync(async (req, res) => {
  const { splitId } = req.params;
  const split = await Split.get(Number(splitId));
  if (!split) throw new Error("Unable to fetch split.");

  const to = split.creditor;
  const from = split.debtor;
  if (!from || !from.email) throw new Error("Failed to fetch debtor's email.");

  const mailOptions: SendMailOptions = {
    from: "addyyy118@gmail.com",
    to: from.email,
    subject: "Payment Reminder",
    html: `
    <p>Hi <strong>${from.name}</strong>!</p>
    <p>You need to pay <strong>₹${split.amount}</strong> to <strong>${to.name}</strong>.</p>
    <p>Thanks,<br/>Fairshare Team</p>
    `,
  };

  transporter.sendMail(
    mailOptions,
    (error: Error | null, info: SentMessageInfo) => {
      if (error) {
        console.error("Error sending email:", error);
        res
          .status(400)
          .json({ message: error.message || "Error sending reminder mail." });
      } else {
        console.log("Email sent:", info.response);
        res
          .status(200)
          .json({ message: "Reminder email was sent successfully!" });
      }
    }
  );
});
