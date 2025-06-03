import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useSelector } from "react-redux";
import { selectCurrentGroup } from "@/store/slices/groupSlice";
import { useGetGroupBalancesQuery } from "@/store/api/apiSlice";

export default function GrpSummary() {
  const group = useSelector(selectCurrentGroup);

  const { data: balances = [] } = useGetGroupBalancesQuery(
    { groupId: group.id },
    {
      pollingInterval: 30000, // Refresh every 30 seconds
    }
  );
  console.log(balances);

  const pendingBalance =
    balances &&
    balances.reduce((total, user) => {
      if (user.balance > 0) {
        return total + user.balance;
      }
      return total;
    }, 0);
  console.log(pendingBalance);

  return (
    <Card className="glass-dark hover-lift rounded-sm border border-gray-700/50 shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="gradient-text-purple text-lg sm:text-xl">
          Group Summary
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 sm:text-base">
          Overview of group expenses
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* number of expenses */}
          <div className="flex justify-between">
            <span className="text-sm text-gray-300 sm:text-base">
              Number of Expenses
            </span>
            <span className="text-sm font-bold text-purple-400 sm:text-base">
              {group?.expenses?.length}
            </span>
          </div>

          {/* group members */}
          <div className="flex justify-between">
            <span className="text-sm text-gray-300 sm:text-base">
              Pending Settlements Amount
            </span>
            <span className="text-sm font-bold text-[#00bcff] sm:text-base">
              ₹{pendingBalance.toFixed(2) || "0.00"}
            </span>
          </div>

          {/* total of group expenses */}
          <div className="flex justify-between">
            <span className="text-sm text-gray-300 sm:text-base">
              Total Group Expenses
            </span>
            <span className="text-sm font-bold text-[#00bcff] sm:text-base">
              ₹{group?.totalExpenses?.toFixed(2) || "0.00"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
