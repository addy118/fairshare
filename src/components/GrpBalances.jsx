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

export default function GrpBalances() {
  const { id: groupId } = useParams();
  const { user: clerkUser } = useUser();
  const user = formatUser(clerkUser);
  const group = useSelector(selectCurrentGroup);
  const members = group?.members;
  console.log("UI Members: ", members);

  const { data: balances = [] } = useGetGroupBalancesQuery(
    { groupId },
    {
      pollingInterval: 30000, // Refresh every 30 seconds
    }
  );

  console.log("UI balances: ", balances);
  return (
    <Card className="glass-dark hover-lift border border-gray-700/50 shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="gradient-text">Group Balances</CardTitle>
        <CardDescription className="text-gray-300">
          Current balance for each member
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-4">
          {balances.length === 0
            ? members?.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-gray-700">
                      <AvatarImage src={member.pfp} />
                    </Avatar>
                    <span className="text-gray-300">{member.name}</span>

                    {member.id === user?.id && (
                      <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-teal-400">
                        You
                      </span>
                    )}
                  </div>

                  {/* display 0 to all users */}
                  <span className="font-medium text-gray-300">₹0.00</span>
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
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-gray-700">
                        <AvatarImage src={member.pfp} />
                      </Avatar>
                      <span className="text-gray-300">{member.name}</span>

                      {isCurrentUser && (
                        <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-teal-400">
                          You
                        </span>
                      )}
                    </div>
                    <span
                      className={`font-medium ${balance > 0 ? "text-green-600" : balance < 0 ? "text-red-500/90" : "text-gray-300"}`}
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
          ;
        </ul>
      </CardContent>
    </Card>
  );
}
