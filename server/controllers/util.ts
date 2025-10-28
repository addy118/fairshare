import { Request, Response } from "express";
import Group from "../queries/Group";
import {
  AdjList,
  CompleteExpense,
  ExpenseEntry,
  HistoryEntry,
  Participant,
  RawExpense,
  SplitEntry,
  SplitHistory,
} from "../types";

function createBalance(expense: RawExpense) {
  const balance: any = {};
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

async function getGroupBalance(
  groupId: number,
  isOptimizing: boolean = false
): Promise<any> {
  // get all the group members
  const members = await Group.members(groupId);
  if (!members) throw new Error("Members not found.");

  // get all the group expenses and splits
  const groupTrans = await Group.expenses(Number(groupId));
  if (!groupTrans) throw new Error("Unable to retrieve group transactions.");
  const { expenses, splits } = groupTrans;

  // filter the splits that needs to be optimized
  // consider the settled splits also as done as they might have been really sent by the user
  let settledSplits = splits.filter(
    (split) => split.confirmed || split.settled
  );

  // only select the confirmed splits for actual balance display
  if (!isOptimizing) {
    settledSplits = splits.filter((split) => split.confirmed);
  }

  let balance: any = {};
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

// deprecated: not used anymore in the code base
function getSplitBalance(splits: SplitHistory[]): any {
  const balance: any = {};

  splits.forEach((split) => {
    if (!balance[split.debtor.id]) balance[split.debtor.id] = 0;
    balance[split.debtor.id] -= split.amount;

    if (!balance[split.creditor.id]) balance[split.creditor.id] = 0;
    balance[split.creditor.id] += split.amount;
  });

  return balance;
}

function calculateSplits(balance: Record<string, number>): AdjList {
  // step 1: separate positive (creditors) and negative (debtors) balances
  const creditors: Participant[] = [];
  const debtors: Participant[] = [];

  for (const [person, amount] of Object.entries(balance)) {
    // handle floating point precision8999
    const roundedAmount = Math.round(amount * 100) / 100;

    if (amount > 0) {
      creditors.push({ name: person, amount: roundedAmount });
    } else if (amount < 0) {
      debtors.push({ name: person, amount: -roundedAmount }); // convert to positive for ease of calculation
    }
  }

  // step 2: sort both arrays by amount in descending order
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const splits: AdjList = [];

  // greedy approach: match largest debtor with largest creditor first
  let i = 0; // pointer for debtors
  let j = 0; // pointer for creditors

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    if (!debtor || !creditor) throw new Error("Undefined debtor or creditor.");

    // calculate the minimum of what is owed and what is to be received
    const transferAmount = Math.min(debtor.amount, creditor.amount);

    // create a transaction
    if (transferAmount > 0) {
      const roundedTransfer = Math.round(transferAmount * 100) / 100;
      splits.push([debtor.name, creditor.name, roundedTransfer]);
    }

    // update remaining balances
    debtor.amount -= transferAmount;
    creditor.amount -= transferAmount;

    // move to next person if balance is settled
    if (debtor.amount < 0.01) i++; // using small threshold for floating point comparison
    if (creditor.amount < 0.01) j++;
  }

  return splits;
}

function mergeChrono(
  expenses: CompleteExpense[],
  splits: SplitHistory[]
): HistoryEntry[] {
  const expEntries: ExpenseEntry[] = expenses.map((expense) => ({
    type: "expense",
    timestamp: expense.createdAt,
    ...expense,
  }));

  const splitEntries: SplitEntry[] = splits.map((split) => ({
    type: "split",
    timestamp: split.updatedAt,
    ...split,
  }));

  return [...expEntries, ...splitEntries].sort((a, b) => {
    if (a.timestamp && b.timestamp)
      return a.timestamp.getTime() - b.timestamp.getTime();
    return 0;
  });
}

// export const getExp = async (req: Request, res: Response): Promise<void> => {
//   try {
//     cb();
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error("Error in getExp(): ", error.message);
//       console.error(error.stack);
//       res
//         .status(400)
//         .json({ message: error.message || "Failed to retrieve expense" });
//     }
//   }
// };

type Controller = (req: Request, res: Response) => Promise<void>;

function catchController(cb: Controller) {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      await cb(req, res);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`Error in ${cb.name}(): `, error.message);
        console.log(error.stack);
        res
          .status(500)
          .json({ message: error.message || "Failed to retrieve expense" });
      } else {
        console.log(`Unknown error caught in ${cb.name}: `, error);
        res
          .status(500)
          .json({ message: "An unknown and unexpected server error occured" });
      }
    }
  };
}

export {
  createBalance,
  calculateSplits,
  getGroupBalance,
  getSplitBalance,
  mergeChrono,
};
