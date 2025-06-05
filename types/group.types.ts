import {
  CompleteExpense,
  CompleteSplit,
  ExpenseEntry,
  SplitEntry,
  User,
} from "./index";

export interface CompleteGroup {
  id: number;
  name: string;
  members: { member: User }[];
  expenses: { id: number; name: string; totalAmt: number }[];
  createdAt: Date;
}

export interface BaseMember {
  memberId: string;
  groupId: number;
  joinedAt: Date;
}

export interface Member {
  memberId: string;
  groupId: number;
  joinedAt: Date;
  member: User;
}

export interface GroupBase {
  id: number;
  name: string;
}

export interface GroupBaseDB extends GroupBase {
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupTrans {
  expenses: CompleteExpense[];
  splits: CompleteSplit[];
}

// append balance to history obj
export interface BalanceEntry {
  balance?: {
    user: {
      id: string;
      name: string | undefined;
      pfp: string | undefined;
    };
    amount: number;
  }[];
}

export type HistoryEntry = (ExpenseEntry | SplitEntry) & BalanceEntry;
