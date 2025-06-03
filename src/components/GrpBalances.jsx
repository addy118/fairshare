import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { selectCurrentGroup } from "@/store/slices/groupSlice";
import { useGetGroupBalancesQuery } from "@/store/api/apiSlice";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import formatUser from "@/utils/formatUser";
import { AvatarFallback } from "@radix-ui/react-avatar";

export default function GrpBalances() {
  const { id: groupId } = useParams();
  const { user: clerkUser } = useUser();
  const user = formatUser(clerkUser);
  const group = useSelector(selectCurrentGroup);
  const members = group?.members;

  const { data: balances = [] } = useGetGroupBalancesQuery(
    { groupId },
    {
      pollingInterval: 30000, // Refresh every 30 seconds
    }
  );

  return (
    <Card className="glass-dark hover-lift border border-gray-700/50 shadow-lg transition-all duration-300">
      <CardHeader className="sm:pb-4">
        <CardTitle className="gradient-text text-lg sm:text-xl">
          Group Balances
        </CardTitle>
        <CardDescription className="text-gray-500 text-sm sm:text-base">
          Current balance for each member
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3 sm:space-y-4">
          {balances.length === 0
            ? members?.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar className="h-6 w-6 border border-gray-700 sm:h-8 sm:w-8">
                      <AvatarImage src={member.pfp || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs sm:text-sm">
                        {member.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-300 sm:text-base">
                      {member.name}
                    </span>

                    {member.id === user?.id && (
                      <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-teal-400">
                        You
                      </span>
                    )}
                  </div>

                  {/* display 0 to all users */}
                  <span className="text-sm font-medium text-gray-300 sm:text-base">
                    ₹0.00
                  </span>
                </li>
              ))
            : members?.map((member) => {
                const balObj = balances.find((b) => b.id === member.id);
                const balance = balObj?.balance ?? 0;
                const isCurrentUser = member.id === user?.id;
                return (
                  <li
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar className="h-6 w-6 border border-gray-700 sm:h-8 sm:w-8">
                        <AvatarImage src={member.pfp || "/placeholder.svg"} />
                      </Avatar>
                      <span className="text-sm text-gray-300 sm:text-base">
                        {member.name}
                      </span>

                      {isCurrentUser && (
                        <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-teal-400">
                          You
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium sm:text-base ${balance > 0 ? "text-green-600" : balance < 0 ? "text-red-500/90" : "text-gray-300"}`}
                    >
                      {balance > 0
                        ? `+₹${balance.toFixed(2)}`
                        : balance < 0
                          ? `-₹${Math.abs(balance).toFixed(2)}`
                          : "₹0.00"}
                    </span>
                  </li>
                );
              })}
        </ul>
      </CardContent>
    </Card>
  );
}
