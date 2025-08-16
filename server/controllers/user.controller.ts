import { Request, Response } from "express";
import User from "../queries/User";

export const test = async (req: Request, res: Response): Promise<void> => {
  const { data } = req.body;
  try {
    const user = await User.get(data);
    if (!user) throw new Error("No user found");
    res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in test():", error.message);
      console.error(error.stack);
      res.status(400).json({ message: error.message || "Failed to test." });
    }
  }
};

export const testProtected = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  if (!userId) throw new Error("Unable to fetch userId.");
  try {
    const user = await User.getById(userId);
    if (!user) throw new Error("No user found");
    res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in testProtecte()d:", error.message);
      console.error(error.stack);
      res
        .status(400)
        .json({ message: error.message || "Failed to test protected route." });
    }
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    if (!userId) throw new Error("Unable to fetch user ID.");
    const user = await User.getById(userId);
    if (!user) throw new Error("No user found");
    res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getUse()r:", error.message);
      console.error(error.stack);
      res
        .status(400)
        .json({ message: error.message || "Failed to fetch user." });
    }
  }
};

export const getUserInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  if (!userId) throw new Error("Unable to fetch userId.");
  try {
    const user = await User.getBasicInfo(userId);
    if (!user) throw new Error("No user found");
    res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getUserInf()o:", error.message);
      console.error(error.stack);
      res
        .status(400)
        .json({ message: error.message || "Failed to fetch user info." });
    }
  }
};

export const getUserBal = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getUserBa()l:", error.message);
      console.error(error.stack);
      res
        .status(400)
        .json({ message: error.message || "Failed to retrieve user balance" });
    }
  }
};

export const getUserGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    if (!userId) throw new Error("Unable to fetch userId.");
    const response = await User.groups(userId);
    if (!response) throw new Error("Unable to fetch user groups.");

    res.status(200).json(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getUserGroup()s:", error.message);
      console.error(error.stack);
      res
        .status(400)
        .json({ message: error.message || "Failed to retrieve user groups" });
    }
  }
};

export const getUserUpi = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    if (!userId) throw new Error("Unable to fetch userId.");
    const upi = await User.getUpi(userId);
    if (!upi) throw new Error("Unable to fetch user's UPI.");
    res.status(200).json(upi);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getUserUpi(): ", error.message);
      console.error(error.stack);
      res
        .status(400)
        .json({ message: error.message || "Failed to fetch the user's UPI" });
    }
  }
};

export const putUserUpi = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    if (!userId) throw new Error("Unable to fetch userId.");
    const { upi } = req.body;
    if (!upi) throw new Error("Unable to fetch upi.");

    await User.putUpi(userId, upi);
    res.status(200).json({ message: "User UPI updated successfully!" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in putUserUpi(): ", error.message);
      console.error(error.stack);
      res
        .status(400)
        .json({ message: error.message || "Failed to update the user's UPI" });
    }
  }
};
