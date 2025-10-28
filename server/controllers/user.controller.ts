import { Request, Response } from "express";
import User from "../queries/User";
import { Controller } from "../types";
import { catchAsync } from "../middleware/catchAsync";

export const test = catchAsync(async (req: Request, res: Response) => {
  const { data } = req.body;
  const user = await User.get(data);
  if (!user) throw new Error("No user found");
  res.status(200).json(user);
});

export const testProtected: Controller = catchAsync(async (req, res) => {
  const { userId } = req.params;
  if (!userId) throw new Error("Unable to fetch userId.");
  const user = await User.getById(userId);
  if (!user) throw new Error("No user found");
  res.status(200).json(user);
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) throw new Error("Unable to fetch user ID.");
  const user = await User.getById(userId);
  if (!user) throw new Error("No user found");
  res.status(200).json(user);
});

export const getUserInfo: Controller = catchAsync(async (req, res) => {
  const { userId } = req.params;
  if (!userId) throw new Error("Unable to fetch userId.");
  const user = await User.getBasicInfo(userId);
  if (!user) throw new Error("No user found");
  res.status(200).json(user);
});

export const getUserGroups: Controller = catchAsync(async (req, res) => {
  const { userId } = req.params;
  if (!userId) throw new Error("Unable to fetch userId.");
  const response = await User.groups(userId);
  if (!response) throw new Error("Unable to fetch user groups.");

  res.status(200).json(response);
});

export const getUserUpi: Controller = catchAsync(async (req, res) => {
  const { userId } = req.params;
  if (!userId) throw new Error("Unable to fetch userId.");
  const upi = await User.getUpi(userId);
  if (!upi) throw new Error("Unable to fetch user's UPI.");
  res.status(200).json(upi);
});

export const putUserUpi: Controller = catchAsync(async (req, res) => {
  const { userId } = req.params;
  if (!userId) throw new Error("Unable to fetch userId.");
  const { upi } = req.body;
  if (!upi) throw new Error("Unable to fetch upi.");

  await User.putUpi(userId, upi);
  res.status(200).json({ message: "User UPI updated successfully!" });
});

export const getUserBal: Controller = catchAsync(async (req, res) => {
  const { userId } = req.params;
  if (!userId) throw new Error("Unable to fetch userId.");

  const balance = await User.balance(userId);
  if (!balance) throw new Error("Unable to fetch balance.");

  // merge logic for debtor
  const mergedDebtor: any = {};
  balance.debtor.forEach((item) => {
    const id = item.creditor.id;
    if (mergedDebtor[id]) {
      mergedDebtor[id].amount += item.amount;
    } else {
      mergedDebtor[id] = { ...item };
    }
  });

  // merge logic for creditor
  const mergedCreditor: any = {};
  balance.creditor.forEach((item) => {
    const id = item.debtor.id;
    if (mergedCreditor[id]) {
      mergedCreditor[id].amount += item.amount;
    } else {
      mergedCreditor[id] = { ...item };
    }
  });

  res.json({
    debtor: Object.values(mergedDebtor),
    creditor: Object.values(mergedCreditor),
  });
});
