import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserPic from "./UserPic";
import { Avatar } from "./ui/avatar";

export default function UserBalance({ balances, isCreditor }) {
  // const isCreditor = isCreditor === "creditor";
  const list = isCreditor ? balances.creditor : balances.debtor;
  const title = isCreditor ? "Money Owed to You" : "Money You Owe";
  const description = isCreditor
    ? "People who need to pay you back"
    : "People you need to pay back";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {list.length === 0 ? (
          <p className="text-muted-foreground">
            {isCreditor
              ? "No one owes you money right now."
              : "You don't owe anyone money right now."}
          </p>
        ) : (
          <ul className="space-y-4">
            {list.map((balance) => (
              <li
                key={isCreditor ? balance.debtor.id : balance.creditor.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <UserPic
                      name={
                        isCreditor ? balance.debtor.name : balance.creditor.name
                      }
                    />
                  </Avatar>
                  <span>
                    {isCreditor ? balance.debtor.name : balance.creditor.name}
                  </span>
                </div>
                <span
                  className={`font-medium ${
                    isCreditor ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCreditor ? "+" : "-"}₹{balance.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between">
          <span className="font-bold">Total</span>
          <span
            className={`font-bold ${
              isCreditor ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCreditor ? "+" : "-"}₹
            {list.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
