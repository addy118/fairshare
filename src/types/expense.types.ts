import { SplitInfo, User } from "./index";

export interface RawExpense {
  name: string;
  groupId: number;
  totalAmt: number;
  payers: RawPayer[];
}

export interface RawPayer {
  name: string;
  payerId: string;
  amount: number;
}

export interface PayerStd {
  payerId: string;
  paidAmt: number;
}

export interface ExpenseDB {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  groupId: number;
  totalAmt: number;
}

export interface ExpenseWithSplits {
  id: number;
  name: string;
  mainGroup: { id: number; name: string };
  totalAmt: number;
  payers: Payer[];
  splits: SplitInfo[];
  _count: { payers: number; splits: number };
}

export interface CompleteExpense {
  id: number;
  name: string;
  totalAmt: number;
  payers: Payer[];
  createdAt: Date;
}

export interface ExpenseEntry extends CompleteExpense {
  // to help ts narrow type
  type: "expense";
  timestamp: Date | undefined;
}

export interface Payer {
  payer: User;
  paidAmt: number;
}

export interface Participant {
  name: string;
  amount: number;
}

export type Edge = [string, string, number];
export type AdjList = Edge[];
