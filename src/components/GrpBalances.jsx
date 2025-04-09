import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { GroupContext } from "@/pages/Group";
import UserPic from "./UserPic";
import { Avatar } from "./ui/avatar";
import GrpSummary from "./GrpSummary";

export default function GrpBalances() {
  const { balances } = useContext(GroupContext);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Group Balances</CardTitle>
          <CardDescription>Current balance for each member</CardDescription>
        </CardHeader>

        <CardContent>
          <ul className="space-y-4">
            {balances.map((balance) => (
              <li
                key={balance.userId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <UserPic name={balance.name} />
                  </Avatar>
                  <span>{balance.name}</span>
                  {balance.isCurrentUser && (
                    <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
                      You
                    </span>
                  )}
                </div>
                {balance.balance > 0 ? (
                  <span className="font-medium text-green-600">
                    +₹{balance.balance.toFixed(2)}
                  </span>
                ) : balance.balance < 0 ? (
                  <span className="font-medium text-red-600">
                    -₹{Math.abs(balance.balance).toFixed(2)}
                  </span>
                ) : (
                  <span className="font-medium">₹0.00</span>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <GrpSummary />
    </div>
  );
}
