import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function UserBalance({ balances, isCreditor }) {
  const list = isCreditor ? balances.creditor : balances.debtor;
  const title = isCreditor ? "Money Owed to You" : "Money You Owe";
  const description = isCreditor
    ? "People who need to pay you back"
    : "People you need to pay back";

  return (
    <Card className="glass-dark hover-lift border border-gray-700/50 shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle
          className={isCreditor ? "gradient-text" : "gradient-text-purple"}
        >
          {title}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {list?.length === 0 ? (
          <p className="text-gray-400">
            {isCreditor
              ? "No one owes you money right now."
              : "You don't owe anyone money right now."}
          </p>
        ) : (
          <ul className="space-y-4">
            {list?.map((balance) => (
              <li
                key={isCreditor ? balance.debtor.id : balance.creditor.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-gray-700">
                    <AvatarImage
                      src={
                        isCreditor ? balance.debtor.pfp : balance.creditor.pfp
                      }
                    />
                  </Avatar>
                  <span className="text-gray-300">
                    {isCreditor ? balance.debtor.name : balance.creditor.name}
                  </span>
                </div>
                <span
                  className={`font-medium ${isCreditor ? "text-green-600" : "text-red-500/90"}`}
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
          <span className="font-bold text-gray-300">Total</span>
          <span
            className={`font-bold ${isCreditor ? "text-green-600" : "text-red-500/90"}`}
          >
            {isCreditor ? "+" : "-"}₹
            {list?.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
