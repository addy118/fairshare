import { GroupBase, User, UserInfo } from "./index";

export interface SplitDB {
  id: number;
  name: string;
  groupId: number;
  expenseId: number | null;
  debtor: UserInfo;
  creditor: UserInfo;
  amount: number;
  settled: boolean;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseSplits {
  amount: number;
  id: number;
  name: string;
  groupId: number;
  expenseId: number | null;
  debtorId: string;
  creditorId: string;
  settled: boolean;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SplitStd {
  name: string;
  groupId: number;
  debtorId: string;
  creditorId: string;
  amount: number;
}

export interface SplitInfo {
  debtor: User;
  creditor: User;
  amount: number;
  settled: boolean;
  confirmed: boolean;
}

export interface SplitHistory {
  id: number;
  debtor: User;
  creditor: User;
  amount: number;
  updatedAt?: Date;
  name?: string;
}

export interface SplitEntry extends SplitHistory {
  // to help ts narrow type
  type: "split";
  timestamp: Date | undefined;
}

export interface CompleteSplit extends SplitHistory {
  mainGroup: GroupBase;
  settled: boolean;
  confirmed: boolean;
  createdAt: Date;
}
