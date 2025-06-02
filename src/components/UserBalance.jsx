import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserBalance({ balances, isCreditor }) {
  const list = isCreditor ? balances?.creditor : balances?.debtor;
  const title = isCreditor ? "Money Owed to You" : "Money You Owe";
  const description = isCreditor
    ? "People who need to pay you back"
    : "People you need to pay back";

  return (
    <Card className="glass-dark hover-lift border border-gray-700/50 shadow-lg transition-all duration-300">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle
          className={`text-lg sm:text-xl ${isCreditor ? "gradient-text" : "gradient-text-purple"}`}
        >
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-300 sm:text-base">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {list?.length === 0 ? (
          <p className="text-sm text-gray-400 sm:text-base">
            {isCreditor
              ? "No one owes you money right now."
              : "You don't owe anyone money right now."}
          </p>
        ) : (
          <ul className="space-y-3 sm:space-y-4">
            {list?.map((balance) => (
              <li
                key={isCreditor ? balance.debtor.id : balance.creditor.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Avatar className="h-6 w-6 border border-gray-700 sm:h-8 sm:w-8">
                    <AvatarImage
                      src={
                        isCreditor ? balance.debtor.pfp : balance.creditor.pfp
                      }
                    />
                    <AvatarFallback className="bg-gray-400 text-xs sm:text-sm">
                      {isCreditor
                        ? balance.debtor.name
                        : balance.creditor.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-300 sm:text-base">
                    {isCreditor ? balance.debtor.name : balance.creditor.name}
                  </span>
                </div>
                <span
                  className={`text-sm font-medium sm:text-base ${isCreditor ? "text-green-600" : "text-red-500/90"}`}
                >
                  {isCreditor ? "+" : "-"}₹{balance.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="pt-3 sm:pt-4">
        <div className="flex w-full justify-between">
          <span className="text-sm font-bold text-gray-300 sm:text-base">
            Total
          </span>
          <span
            className={`text-sm font-bold sm:text-base ${isCreditor ? "text-green-600" : "text-red-500/90"}`}
          >
            {isCreditor ? "+" : "-"}₹
            {list?.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
