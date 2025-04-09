import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaymentHistory from "@/components/payment-history";

export default function GroupHistoryPage({ params }) {
  const { id: groupId } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we'll use the dummy data provided

    // Mock group data
    const dummyGroup = {
      id: groupId,
      name: "Hogwarts Trip",
    };

    // Mock history data from the provided example
    const dummyHistory = [
      {
        type: "expense",
        timestamp: "2025-04-08T03:31:34.395Z",
        id: 1,
        name: "exp1",
        totalAmt: 250,
        createdAt: "2025-04-08T03:31:34.395Z",
        payers: [
          { payer: { id: 4, name: "Dumbledore" }, paidAmt: 50 },
          { payer: { id: 3, name: "Hagrid" }, paidAmt: 0 },
          { payer: { id: 2, name: "Hermione" }, paidAmt: 200 },
        ],
        balance: [
          { user: { id: 1, name: "Harry" }, amount: 0 },
          { user: { id: 2, name: "Hermione" }, amount: 117 },
          { user: { id: 3, name: "Hagrid" }, amount: -83 },
          { user: { id: 4, name: "Dumbledore" }, amount: -33 },
          { user: { id: 5, name: "Voldemort" }, amount: 0 },
        ],
      },
      {
        type: "expense",
        timestamp: "2025-04-08T03:31:51.221Z",
        id: 2,
        name: "exp2",
        totalAmt: 50,
        createdAt: "2025-04-08T03:31:51.221Z",
        payers: [
          { payer: { id: 3, name: "Hagrid" }, paidAmt: 50 },
          { payer: { id: 2, name: "Hermione" }, paidAmt: 0 },
        ],
        balance: [
          { user: { id: 1, name: "Harry" }, amount: 0 },
          { user: { id: 2, name: "Hermione" }, amount: 92 },
          { user: { id: 3, name: "Hagrid" }, amount: -58 },
          { user: { id: 4, name: "Dumbledore" }, amount: -33 },
          { user: { id: 5, name: "Voldemort" }, amount: 0 },
        ],
      },
      {
        type: "expense",
        timestamp: "2025-04-08T03:32:55.848Z",
        id: 3,
        name: "exp3",
        totalAmt: 290,
        createdAt: "2025-04-08T03:32:55.848Z",
        payers: [
          { payer: { id: 1, name: "Harry" }, paidAmt: 60 },
          { payer: { id: 5, name: "Voldemort" }, paidAmt: 100 },
          { payer: { id: 4, name: "Dumbledore" }, paidAmt: 80 },
          { payer: { id: 3, name: "Hagrid" }, paidAmt: 40 },
          { payer: { id: 2, name: "Hermione" }, paidAmt: 10 },
        ],
        balance: [
          { user: { id: 1, name: "Harry" }, amount: 2 },
          { user: { id: 2, name: "Hermione" }, amount: 44 },
          { user: { id: 3, name: "Hagrid" }, amount: -76 },
          { user: { id: 4, name: "Dumbledore" }, amount: -11 },
          { user: { id: 5, name: "Voldemort" }, amount: 42 },
        ],
      },
      {
        type: "expense",
        timestamp: "2025-04-08T03:33:11.284Z",
        id: 4,
        name: "exp4",
        totalAmt: 60,
        createdAt: "2025-04-08T03:33:11.284Z",
        payers: [
          { payer: { id: 1, name: "Harry" }, paidAmt: 10 },
          { payer: { id: 4, name: "Dumbledore" }, paidAmt: 20 },
          { payer: { id: 3, name: "Hagrid" }, paidAmt: 30 },
        ],
        balance: [
          { user: { id: 1, name: "Harry" }, amount: -8 },
          { user: { id: 2, name: "Hermione" }, amount: 44 },
          { user: { id: 3, name: "Hagrid" }, amount: -66 },
          { user: { id: 4, name: "Dumbledore" }, amount: -11 },
          { user: { id: 5, name: "Voldemort" }, amount: 42 },
        ],
      },
    ];

    setHistory(dummyHistory);
    setGroup(dummyGroup);
    setIsLoading(false);
  }, [groupId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading history...
      </div>
    );
  }

  return (
    <div className="container mx-auto mb-6 px-4 py-8">
      <h1 className="text-2xl font-bold">{group?.name} - Payment History</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            All expenses and settlements in this group
          </CardDescription>
        </CardHeader>

        <CardContent>
          <PaymentHistory history={history} />
        </CardContent>
      </Card>
    </div>
  );
}
