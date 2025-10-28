import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
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
} from "@/redux/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { isMobile } from "react-device-detect";
import { QRCodeSVG } from "qrcode.react";
import { selectCurrentGroup } from "@/redux/groupSlice";

export default function Settlements() {
  const { user: clerkUser } = useUser();
  const group = useSelector(selectCurrentGroup);
  console.log(group.id);
  const user = formatUser(clerkUser);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // get settlements from Redux store in sorted form
  const settlements = useSelector((state) => {
    const arr = state.group.settlements || [];
    return [...arr].sort((a, b) => {
      // category: 0 = unsettled/unconfirmed, 1 = settled, 2 = confirmed
      const getCategory = (s) => (s.confirmed ? 2 : s.settled ? 1 : 0);
      const catA = getCategory(a);
      const catB = getCategory(b);
      if (catA !== catB) return catA - catB;
      // sort by createdAt descending (latest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  });

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
    <div className="space-y-4 sm:space-y-6">
      {settlements?.length === 0 ? (
        <Card className="glass-dark border border-gray-700/50 shadow-lg">
          <CardContent className="pt-4 sm:pt-6">
            <p className="text-center text-sm text-gray-300 sm:text-base">
              No settlements exist. Add expenses in the group to generate
              settlements!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mb-20 space-y-3 sm:space-y-4">
          <>
            <Button
              className="w-full rounded-sm bg-gradient-to-r from-purple-600 to-purple-500 text-sm text-white shadow-lg transition-all duration-300 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-500/30 sm:text-base"
              size="sm"
              onClick={handleOptimization}
              style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}
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
                  <CardContent className="px-4 sm:px-4">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      {/* Settlement participants */}
                      <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-4">
                        <Avatar className="h-8 w-8 border border-gray-700 sm:h-10 sm:w-10">
                          <AvatarImage
                            src={settlement.from.pfp || "/placeholder.svg"}
                          />
                          <AvatarFallback className="bg-gray-400 text-xs sm:text-sm">
                            {settlement.from.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-300 sm:text-base">
                            {settlement.from.name}
                          </span>
                        </div>

                        <span className="text-xs text-gray-400 sm:text-sm">
                          {settlement.confirmed ? "paid" : "needs to pay"}
                        </span>

                        {/* destination */}
                        <Avatar className="h-8 w-8 border border-gray-700 sm:h-10 sm:w-10">
                          <AvatarImage
                            src={settlement.to.pfp || "/placeholder.svg"}
                          />
                          <AvatarFallback className="bg-gray-400 text-xs sm:text-sm">
                            {settlement.to.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-300 sm:text-base">
                            {settlement.to.name}
                          </span>
                        </div>
                      </div>

                      {/* Amount and actions */}
                      <div className="flex items-center justify-center gap-2 lg:flex lg:justify-between lg:gap-4">
                        <span className="text-sm font-bold text-[#00bcff] sm:text-base">
                          ₹{settlement.amount.toFixed(2)}
                        </span>

                        {/* status */}
                        {settlement.confirmed ? (
                          <span className="flex items-center text-xs text-green-600 sm:text-sm">
                            Settled
                          </span>
                        ) : settlement.settled &&
                          settlement.to.id !== user.id ? (
                          <span className="text-xs text-yellow-500 sm:text-sm">
                            Waiting for confirmation
                          </span>
                        ) : settlement.to.id === user.id &&
                          settlement.settled ? (
                          <div className="flex flex-row gap-1">
                            <Button
                              size="sm"
                              className="h-6 bg-green-600 text-xs hover:bg-green-700 sm:h-8 sm:text-sm"
                              onClick={() => handleConfirm(settlement.id, true)}
                            >
                              Received
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 border-gray-700 text-xs hover:bg-gray-700/70 hover:text-red-400 sm:h-8 sm:text-sm"
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
                              className="h-6 rounded-sm bg-[#00bcff] text-xs text-[#111828] hover:bg-[#00a6ff] sm:h-8 sm:text-sm"
                              onClick={() => setOpenModalId(settlement.id)}
                            >
                              Settle
                            </Button>

                            {/* Modal for Settle */}
                            <Dialog
                              open={openModalId === settlement.id}
                              onOpenChange={() => setOpenModalId(null)}
                            >
                              <DialogContent className="mx-4 max-w-sm border border-gray-700/70 bg-gray-900 sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="text-lg text-[#00bcff] sm:text-xl">
                                    Settle Payment
                                  </DialogTitle>
                                  <DialogDescription className="text-sm text-gray-400 sm:text-base">
                                    Pay{" "}
                                    <span className="font-bold text-[#00bcff]">
                                      ₹{settlement.amount.toFixed(2)}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-semibold">
                                      {settlement.to.name}
                                    </span>
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="mt-4 flex flex-col items-center gap-3 sm:gap-4">
                                  {settlement.to.upi && (
                                    <QRCodeSVG
                                      value={`upi://pay?pa=${settlement.to.upi || ""}&pn=${encodeURIComponent(settlement.to.name)}&am=${settlement.amount}&cu=INR&tn=${settlement.name || `Settle debt from Fairshare`}`}
                                      size={200}
                                      marginSize="1"
                                      bgColor="#ADCDFF"
                                      fgColor="#111828"
                                      className="sm:size-[200px]"
                                    />
                                  )}

                                  <Button
                                    variant="outline"
                                    className="w-full border-[#00a2ff] text-sm text-[#00bcff] hover:bg-teal-600/10 sm:text-base"
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
                                    className="w-full bg-[#00a2ff] text-sm text-white hover:bg-teal-600 sm:text-base"
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
                            className="h-6 border-gray-700 text-xs hover:bg-gray-700/70 hover:text-[#00bcff] sm:h-8 sm:text-sm"
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
