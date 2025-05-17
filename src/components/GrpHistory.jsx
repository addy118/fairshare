import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { GroupContext } from "@/pages/Group";
import ExpDialog from "./ExpDialog";
import PaymentHistory from "./PaymentHistory";

export default function GrpHistory() {
  const { expenses, history, setSelectedItem, setDetailsOpen } =
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
          <PaymentHistory />
        </CardContent>
      </Card>

      <ExpDialog />
    </>
  );
}
