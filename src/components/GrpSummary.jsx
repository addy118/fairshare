import React, { useContext, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { GroupContext } from "@/pages/Group";
import { fetchGroup } from "@/utils/fetchGroupData";
import { useParams } from "react-router-dom";

export default function GrpSummary() {
  const { id: groupId } = useParams();
  const { group, setGroup } = useContext(GroupContext);

  // refresh group
  useEffect(() => {
    const refreshGroup = async () => {
      const newGroup = await fetchGroup(groupId);
      setGroup(newGroup);
    };
    refreshGroup();
  }, [groupId]);

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
              ₹{group.totalExpenses?.toFixed(2) || "0.00"}
            </span>
          </div>

          {/* number of expenses */}
          <div className="flex justify-between">
            <span className="text-gray-300">Number of Expenses</span>
            <span className="font-bold text-purple-400">
              {group.expenses?.length}
            </span>
          </div>

          {/* group members */}
          <div className="flex justify-between">
            <span className="text-gray-300">Group Members</span>
            <span className="font-bold text-teal-400">{group.memberCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
