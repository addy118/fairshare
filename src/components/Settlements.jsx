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
import { toast } from "sonner";

export default function Settlements() {
  const { id: groupId } = useParams();
  const { user } = useAuth();
  const { settlements, setSettlements, setBalances } = useContext(GroupContext);
  const [loading, setLoading] = useState(false);
  // console.log(settlements);

  const handleOptimization = async () => {
    try {
      console.log("optimizing splits...");

      setLoading(true);
      await api.get(`grp/${groupId}/splits/min`);
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

  const handleSettle = async (settlementId) => {
    try {
      await api.put(`/exp/${settlementId}/settle`);

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

  const handleConfirm = async (settlementId, status) => {
    try {
      await api.put(
        `/exp/${settlementId}/${status ? "confirm" : "not-confirm"}`
      );

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

  const handleRemind = async (settlementId, toUserId) => {
    try {
      console.log("remind user " + toUserId);
      const res = await api.get(`/user/${Number(toUserId)}/info`);
      const toUser = res.data;

      toast.success(`Reminded to ${toUser.email}`);
      
      console.log(toUser);
    } catch (err) {
      console.error("Failed to settle transaction:", err);
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
                className={`${settlement.confirmed ? "opacity-50" : ""} rounded-sm`}
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

                    {/* amount */}
                    <div className="flex items-center gap-4">
                      <span className="font-bold">
                        ₹{settlement.amount.toFixed(2)}
                      </span>

                      {/* status */}
                      {settlement.confirmed ? (
                        <span className="flex items-center text-green-600">
                          <Check className="mr-1 h-4 w-4" />
                          Settled
                        </span>
                      ) : settlement.from.id === user.id &&
                        settlement.settled ? (
                        <span className="text-yellow-500">Waiting</span>
                      ) : settlement.to.id === user.id && settlement.settled ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleConfirm(settlement.id, true)}
                          >
                            Received
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirm(settlement.id, false)}
                          >
                            Didn't receive
                          </Button>
                        </div>
                      ) : settlement.from.id === user.id &&
                        !settlement.settled ? (
                        <Button
                          size="sm"
                          onClick={() => handleSettle(settlement.id)}
                        >
                          Settle
                        </Button>
                      ) : settlement.to.id === user.id &&
                        !settlement.settled ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleRemind(settlement.id, settlement.to.id)
                          }
                        >
                          Remind
                        </Button>
                      ) : null}
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
