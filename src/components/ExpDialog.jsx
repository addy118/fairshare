import React, { useContext } from "react";
import { GroupContext } from "@/pages/Group";
import { Avatar } from "./ui/avatar";
import UserPic from "./UserPic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";

export default function ExpDialog() {
  const { selectedItem, detailsOpen, setDetailsOpen } =
    useContext(GroupContext);

  return (
    <>
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          {selectedItem && selectedItem.type === "expense" && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.description}</DialogTitle>
                <DialogDescription>
                  Added on {new Date(selectedItem.date).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span className="font-bold">
                    ₹{selectedItem.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Paid by</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.pfp} />
                    </Avatar>
                    <span>{selectedItem.paidBy.name}</span>
                    {selectedItem.paidBy.isCurrentUser && (
                      <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
                        You
                      </span>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-2 font-medium">Split Between</h4>
                  <ul className="space-y-2">
                    {selectedItem.splits?.map((split, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.pfp} />
                          </Avatar>

                          <span>{split.user.name}</span>

                          {split.user.isCurrentUser && (
                            <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
                              You
                            </span>
                          )}
                        </div>
                        <span>₹{split.amount.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {selectedItem.notes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="mb-2 font-medium">Notes</h4>
                      <p className="text-sm">{selectedItem.notes}</p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {selectedItem && selectedItem.type === "settlement" && (
            <>
              <DialogHeader>
                <DialogTitle>Settlement Details</DialogTitle>
                <DialogDescription>
                  {selectedItem.settled
                    ? "Settled on " +
                      new Date(selectedItem.settledDate).toLocaleDateString()
                    : "Pending settlement"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex justify-between">
                  <span>Amount</span>
                  <span className="font-bold">
                    ₹{selectedItem.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>From</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.pfp} />
                    </Avatar>
                    <span>{selectedItem.from.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>To</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.pfp} />
                    </Avatar>
                    <span>{selectedItem.to.name}</span>
                  </div>
                </div>
                {selectedItem.settled && (
                  <div className="flex items-center text-green-600">
                    <Check className="mr-2 h-4 w-4" />
                    <span>This settlement has been marked as complete</span>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
