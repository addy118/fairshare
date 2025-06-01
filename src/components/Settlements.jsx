import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Check } from "lucide-react";
import Loading from "./Loading";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import formatUser from "@/utils/formatUser";
import { useSelector } from "react-redux";
import {
  useOptimizeSettlementsMutation,
  useSettlePaymentMutation,
  useConfirmSettlementMutation,
  useRemindSettlementMutation,
} from "@/store/api/apiSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { isMobile } from "react-device-detect";
import { QRCodeSVG } from "qrcode.react";
import { selectCurrentGroup } from "@/store/slices/groupSlice";

export default function Settlements() {
  const { user: clerkUser } = useUser();
  const group = useSelector(selectCurrentGroup);
  console.log(group.id);
  const user = formatUser(clerkUser);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Get settlements from Redux store
  const settlements = useSelector((state) => state.group.settlements);

  // RTK Query mutations
  const [optimizeSettlements] = useOptimizeSettlementsMutation();
  const [settlePayment] = useSettlePaymentMutation();
  const [confirmSettlement] = useConfirmSettlementMutation();
  const [remindSettlement] = useRemindSettlementMutation();

  const handleOptimization = async () => {
    try {
      setIsOptimizing(true);
      await optimizeSettlements(group.id);
      setIsOptimizing(false);
    } catch (error) {
      console.log("Failed to optimize splits: ", error);
      toast.error(error.response?.data?.message);
    }
  };

  const handleSettle = async (settlementId) => {
    try {
      await settlePayment(settlementId);
    } catch (error) {
      console.error("Failed to settle transaction:", error);
    }
  };

  const handleConfirm = async (settlementId, status) => {
    try {
      await confirmSettlement({ settlementId, status });
    } catch (error) {
      console.error("Failed to settle transaction:", error);
    }
  };

  const handleRemind = async (settlementId, fromUser) => {
    try {
      await remindSettlement(settlementId);
      toast.dismiss();
      toast.success(`Reminded to ${fromUser}`);
    } catch (error) {
      toast.dismiss();
      console.error("Failed to settle transaction:", error);
      toast.error("Failed to remind the user");
    }
  };

  // Modal state
  const [openModalId, setOpenModalId] = useState(null);

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
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg transition-all duration-300 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-500/30"
              size="sm"
              onClick={handleOptimization}
              style={{ letterSpacing: "0.5em", textTransform: "uppercase" }}
            >
              {isOptimizing ? (
                <Loading action="Optimizing" item="splits" />
              ) : (
                "Optimize Splits"
              )}
            </Button>
            {settlements?.map((settlement) => (
              <React.Fragment key={settlement.id}>
                <Card
                  className={`${settlement.confirmed ? "opacity-50" : ""} glass-dark rounded-sm border border-gray-700/50`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* source */}
                        <Avatar className="border border-gray-700">
                          <AvatarImage src={settlement.from.pfp} />
                          <AvatarFallback className="bg-gray-400">
                            {settlement.from.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                          <span className="font-medium text-gray-300">
                            {settlement.from.name}
                          </span>
                        </div>

                        <span className="text-sm text-gray-400">
                          {settlement.confirmed ? "paid" : "needs to pay"}
                        </span>

                        {/* destination */}
                        <Avatar className="border border-gray-700">
                          <AvatarImage src={settlement.to.pfp} />
                          <AvatarFallback className="bg-gray-400">
                            {settlement.to.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
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
                        ) : settlement.to.id === user.id &&
                          settlement.settled ? (
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
                              onClick={() =>
                                handleConfirm(settlement.id, false)
                              }
                            >
                              Didn't receive
                            </Button>
                          </div>
                        ) : settlement.from.id === user.id &&
                          !settlement.settled ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-teal-500 hover:bg-teal-600"
                              onClick={() => setOpenModalId(settlement.id)}
                            >
                              Settle
                            </Button>

                            {/* Modal for Settle */}
                            <Dialog
                              open={openModalId === settlement.id}
                              onOpenChange={() => setOpenModalId(null)}
                            >
                              <DialogContent className="border border-gray-700/70 bg-[#111828]">
                                <DialogHeader>
                                  <DialogTitle className="text-teal-400">
                                    Settle Payment
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-400">
                                    Pay{" "}
                                    <span className="font-bold text-teal-400">
                                      ₹{settlement.amount.toFixed(2)}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-semibold">
                                      {settlement.to.name}
                                    </span>
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="mt-4 flex flex-col items-center gap-4">
                                  {settlement.to.upi && (
                                    <QRCodeSVG
                                      value={`upi://pay?pa=${settlement.to.upi || ""}&pn=${encodeURIComponent(settlement.to.name)}&am=${settlement.amount}&cu=INR&tn=${settlement.name || `Settle debt from Fairshare`}`}
                                      size={200}
                                      bgColor="#14b8a6"
                                      fgColor="#111828"
                                    />
                                  )}

                                  <Button
                                    variant="outline"
                                    className="w-full border-teal-500 text-teal-400 hover:bg-teal-600/10"
                                    onClick={() => {
                                      if (
                                        isMobile &&
                                        settlement.to.upi &&
                                        settlement.from.upi
                                      ) {
                                        window.open(
                                          `upi://pay?pa=${settlement.to.upi || ""}&pn=${encodeURIComponent(settlement.to.name)}&am=${settlement.amount}&cu=INR`,
                                          "_blank"
                                        );
                                      } else if (!settlement.to.upi) {
                                        toast.message(
                                          "The receiver don't have a UPI ID set!"
                                        );
                                      } else if (!settlement.from.upi) {
                                        toast.message(
                                          "You don't have a UPI ID set! Please set it from the home page to proceed!"
                                        );
                                      } else {
                                        toast.message(
                                          "Please use a mobile device to directly use your UPI App!"
                                        );
                                      }
                                    }}
                                  >
                                    Pay via UPI App
                                  </Button>
                                  <Button
                                    className="w-full bg-teal-500 text-white hover:bg-teal-600"
                                    onClick={async () => {
                                      await handleSettle(settlement.id);
                                      setOpenModalId(null);
                                    }}
                                  >
                                    Payment Done
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
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
              </React.Fragment>
            ))}
          </>
        </div>
      )}
    </div>
  );
}
