import React, { useContext, useEffect, useState } from "react";
import UserPic from "./UserPic";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useAuth } from "@/authProvider";
import { GroupContext } from "@/pages/Group";
import { Check } from "lucide-react";
import api from "@/axiosInstance";
import {
  fetchBalances,
  fetchExpensesAndSettlments,
} from "@/utils/fetchGroupData";
import { useParams } from "react-router-dom";
import format from "@/utils/formatGroup";
import Loading from "./Loading";

export default function Settlements() {
  const { id: groupId } = useParams();
  const { user } = useAuth();
  const { settlements, setSettlements, setBalances } = useContext(GroupContext);
  const [loading, setLoading] = useState(false);

  const handleOptimization = async () => {
    try {
      console.log("optimizing splits...");

      setLoading(true);
      await api.post(`grp/${groupId}/splits/min`);
      setLoading(false);

      // fetch new optimized splits
      const { settlementsData } = await fetchExpensesAndSettlments(groupId);

      // update settlements
      setSettlements(settlementsData);

      // refresh balances after settlement
      const balanceData = await fetchBalances(groupId, user.id);
      setBalances(balanceData);
    } catch (err) {
      console.error("Failed to optimize splits: ", err);
    }
  };

  const handleSettleTransaction = async (settlementId) => {
    try {
      await api.post(`/exp/${settlementId}/settle`);

      const { settlementsData } = await fetchExpensesAndSettlments(groupId);

      // update settlements
      setSettlements(settlementsData);

      // refresh balances after settlement
      const balanceData = await fetchBalances(groupId, user.id);
      setBalances(balanceData);
    } catch (error) {
      console.error("Failed to settle transaction:", error);
    }
  };

  return (
    <div className="space-y-6">
      {settlements?.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">
              No settlements exist. Add expenses in the group to generate
              settlements!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mb-20 space-y-4">
          <>
            <Button
              className="w-full"
              size="sm"
              variant="outline"
              onClick={handleOptimization}
              style={{ letterSpacing: "0.5em" }}
            >
              {loading ? (
                <Loading action="Optimizing" item="splits" />
              ) : (
                "Optimize Splits"
              )}
            </Button>
            {settlements?.map((settlement) => (
              <Card
                key={settlement.id}
                className={settlement.settled ? "opacity-50" : ""}
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* source */}
                      <Avatar>
                        <UserPic name={settlement.from.name} />
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="font-medium">
                          {settlement.from.name}
                        </span>
                      </div>

                      <span className="text-muted-foreground text-sm">
                        owes
                      </span>

                      {/* destination */}
                      <Avatar>
                        <UserPic name={settlement.to.name} />
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {settlement.to.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold">
                        ₹{settlement.amount.toFixed(2)}
                      </span>

                      {settlement.settled ? (
                        <span className="flex items-center text-green-600">
                          <Check className="mr-1 h-4 w-4" />
                          Settled
                        </span>
                      ) : user.id == settlement.from.id ? (
                        <Button
                          size="sm"
                          onClick={() => handleSettleTransaction(settlement.id)}
                        >
                          Settle
                        </Button>
                      ) : (
                        " "
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        </div>
      )}
    </div>
  );
}
