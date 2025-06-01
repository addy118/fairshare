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

export default function GrpSummary() {
  const group = useSelector(selectCurrentGroup);

  return (
    <Card className="glass-dark hover-lift border border-gray-700/50 shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="gradient-text-purple">Group Summary</CardTitle>
        <CardDescription className="text-gray-300">
          Overview of group expenses
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* total of group expenses */}
          <div className="flex justify-between">
            <span className="text-gray-300">Total Group Expenses</span>
            <span className="font-bold text-teal-400">
              ₹{group?.totalExpenses?.toFixed(2) || "0.00"}
            </span>
          </div>

          {/* number of expenses */}
          <div className="flex justify-between">
            <span className="text-gray-300">Number of Expenses</span>
            <span className="font-bold text-purple-400">
              {group?.expenses?.length}
            </span>
          </div>

          {/* group members */}
          <div className="flex justify-between">
            <span className="text-gray-300">Group Members</span>
            <span className="font-bold text-teal-400">
              {group?.memberCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
