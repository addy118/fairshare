import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import ExpDialog from "./ExpDialog";
import PaymentHistory from "./PaymentHistory";

export default function GrpHistory() {
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
