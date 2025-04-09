import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { GroupContext } from "@/pages/Group";
import { Avatar } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import UserPic from "./UserPic";
import ExpDialog from "./ExpDialog";

export default function GrpHistory() {
  const { expenses, setSelectedItem, setDetailsOpen } =
    useContext(GroupContext);

  // trigger expense details dialog
  const showDetails = (item, type) => {
    setSelectedItem({ ...item, type });
    setDetailsOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Payments History</CardTitle>
          <CardDescription>All payments in this group</CardDescription>
        </CardHeader>

        <CardContent>
          {expenses.length === 0 ? (
            <p className="py-4 text-center">
              No payments yet. Add your first expense!
            </p>
          ) : (
            <ScrollArea className="max-h-[70vh] overflow-auto">
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    onClick={() => showDetails(expense, "expense")}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <UserPic name={expense.paidBy.name} />
                        </Avatar>

                        <div>
                          <div className="font-medium">
                            {expense.description}
                          </div>

                          <div className="text-muted-foreground text-sm">
                            Paid by {expense.paidBy.name} •{" "}
                            {new Date(expense.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <span className="font-bold">
                        ₹{expense.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <ExpDialog />
    </>
  );
}
