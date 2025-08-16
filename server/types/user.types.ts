import {
  DeletedObjectJSON,
  UserJSON,
} from "@clerk/express";

export interface User {
  id: string;
  name: string | null;
  username: string | null;
  pfp: string | null;
  upi: string | null;
}

export interface UserInfo extends User {
  email: string | null;
}

export interface ClerkUser {
  first_name: string;
  last_name: string;
  username: string;
  email_addresses: { email_address: string }[];
  created_at: number;
  updated_at: number;
  image_url: string;
  id: string;
}

export type ClerkEvent =
  | { type: "user.created" | "user.updated"; data: UserJSON }
  | { type: "user.deleted"; data: DeletedObjectJSON };

export interface UserDB {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  upi: string | null;
  createdAt: Date;
  updatedAt: Date;
  pfp: string | null;
}

export interface LoginUser extends UserDB {
  groups: UserGroup[];
}

export interface UserGroup {
  group: {
    id: number;
    name: string;
    createdAt: Date;
    members: { member: User }[];
  };
}

export interface UserBalance {
  debtor: {
    amount: number;
    creditor: User;
  }[];
  creditor: {
    amount: number;
    debtor: User;
  }[];
}
