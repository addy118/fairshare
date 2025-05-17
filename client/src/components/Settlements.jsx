import React, { useContext, useState } from "react";
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
import Loading from "./Loading";
import { toast } from "sonner";

export default function Settlements() {
  const { id: groupId } = useParams();
  const { user } = useAuth();
  const { settlements, setSettlements, setBalances } = useContext(GroupContext);
  const [loading, setLoading] = useState(false);

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

  const handleRemind = async (settlementId, fromUser) => {
    try {
      // console.log("remind user " + fromUser);

      const remindRes = await api.post(`/exp/${Number(settlementId)}/remind`);
      if (remindRes.status != 200) throw new Error("Unexpected error!");

      toast.dismiss();
      toast.success(`Reminded to ${fromUser}`);
    } catch (err) {
      toast.dismiss();
      console.error("Failed to settle transaction:", err);
      toast.error("Failed to remind the user");
    }
  };

  return (
    <div className="space-y-6">
      {settlements?.length === 0 ? (
        <Card className="glass-dark border border-gray-700/50 shadow-lg">
          <CardContent className="pt-6">
            <p className="text-center text-gray-300">
              No settlements exist. Add expenses in the group to generate
              settlements!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mb-20 space-y-4">
          <>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg transition-all duration-300 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-500/30 "
              size="sm"
              onClick={handleOptimization}
              style={{ letterSpacing: "0.5em", textTransform: "uppercase" }}
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
                className={`${settlement.confirmed ? "opacity-50" : ""} glass-dark rounded-sm border border-gray-700/50`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* source */}
                      <Avatar className="border border-gray-700">
                        <UserPic name={settlement.from.name} />
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="font-medium text-gray-300">
                          {settlement.from.name}
                        </span>
                      </div>

                      <span className="text-sm text-gray-400">owes</span>

                      {/* destination */}
                      <Avatar className="border border-gray-700">
                        <UserPic name={settlement.to.name} />
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-300">
                          {settlement.to.name}
                        </span>
                      </div>
                    </div>

                    {/* amount */}
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-teal-400">
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
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleConfirm(settlement.id, true)}
                          >
                            Received
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-700 hover:bg-gray-700/70 hover:text-red-400"
                            onClick={() => handleConfirm(settlement.id, false)}
                          >
                            Didn't receive
                          </Button>
                        </div>
                      ) : settlement.from.id === user.id &&
                        !settlement.settled ? (
                        <Button
                          size="sm"
                          className="bg-teal-500 hover:bg-teal-600"
                          onClick={() => handleSettle(settlement.id)}
                        >
                          Settle
                        </Button>
                      ) : settlement.to.id === user.id &&
                        !settlement.settled ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-700 hover:bg-gray-700/70 hover:text-teal-400"
                          onClick={() =>
                            handleRemind(settlement.id, settlement.from.name)
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
