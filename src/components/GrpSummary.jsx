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
    <Card>
      <CardHeader>
        <CardTitle>Group Summary</CardTitle>
        <CardDescription>Overview of group expenses</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* total of group expenses */}
          <div className="flex justify-between">
            <span>Total Group Expenses</span>
            <span className="font-bold">
              ₹{group.totalExpenses?.toFixed(2) || "0.00"}
            </span>
          </div>

          {/* number of expenses */}
          <div className="flex justify-between">
            <span>Number of Expenses</span>
            <span className="font-bold">{group.expenses?.length}</span>
          </div>

          {/* group members */}
          <div className="flex justify-between">
            <span>Group Members</span>
            <span className="font-bold">{group.memberCount}</span>
          </div>

          {/* user balance */}
          {/* <div className="flex justify-between">
            <span>Your Balance</span>
            {group.userBalance > 0 ? (
              <span className="font-bold text-green-600">
                +₹{group.userBalance.toFixed(2)}
              </span>
            ) : group.userBalance < 0 ? (
              <span className="font-bold text-red-600">
                -₹{Math.abs(group.userBalance).toFixed(2)}
              </span>
            ) : (
              <span className="font-bold">₹0.00</span>
            )}
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
