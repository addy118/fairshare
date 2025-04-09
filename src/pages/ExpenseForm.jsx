import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function ExpenseForm() {
  const navigate = useNavigate();
  const { groupId } = useParams();

  // mock users data - replace with actual data from your api
  const [users, setUsers] = useState([
    { id: "user1", name: "John Doe" },
    { id: "user2", name: "Alice Smith" },
    { id: "user3", name: "Bob Johnson" },
    { id: "user4", name: "Carol Williams" },
  ]);

  // form state
  const [expenseName, setExpenseName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [payers, setPayers] = useState([
    { id: Date.now(), payerId: "", amount: "" },
  ]);
  const [payersTotal, setPayersTotal] = useState(0);

  // calculate total whenever payers change
  useEffect(() => {
    const total = payers.reduce((sum, payer) => {
      return sum + (Number.parseFloat(payer.amount) || 0);
    }, 0);
    setPayersTotal(total);
  }, [payers]);

  const addPayer = () => {
    setPayers([...payers, { id: Date.now(), payerId: "", amount: "" }]);
  };

  const removePayer = (id) => {
    if (payers.length > 1) {
      setPayers(payers.filter((payer) => payer.id !== id));
    }
  };

  const updatePayer = (id, field, value) => {
    setPayers(
      payers.map((payer) =>
        payer.id === id ? { ...payer, [field]: value } : payer
      )
    );
  };

  const handleCreateExpense = (expense) => {
    // in a real app, you would send this to your api
    console.log("Creating expense:", expense);

    // navigate to the groups page
    navigate(`/groups/${groupId}`);

    console.log("Expense submitted");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!expenseName.trim()) {
      alert("Please enter an expense name");
      return;
    }

    if (!totalAmount || Number.parseFloat(totalAmount) <= 0) {
      alert("Please enter a valid total amount");
      return;
    }

    const invalidPayers = payers.some(
      (payer) => !payer.payerId || !payer.amount
    );
    if (invalidPayers) {
      alert("Please fill in all payer details");
      return;
    }

    if (Math.abs(Number.parseFloat(totalAmount) - payersTotal) > 0.01) {
      alert(
        `Payer amounts total (${payersTotal.toFixed(
          2
        )}) doesn't match expense total (${Number.parseFloat(
          totalAmount
        ).toFixed(2)})`
      );
      return;
    }

    const expense = {
      name: expenseName,
      totalAmount: Number.parseFloat(totalAmount),
      payers: payers.map(({ payerId, amount }) => ({
        payerId,
        amount: Number.parseFloat(amount),
      })),
      groupId,
    };

    handleCreateExpense(expense);

    setExpenseName("");
    setTotalAmount("");
    setPayers([{ id: Date.now(), payerId: "", amount: "" }]);
  };

  return (
    <div className="mx-auto max-w-xl px-4">
      <h1 className="mb-4 text-2xl font-bold">Create Expense</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create New Expense</CardTitle>
          <CardDescription>
            Add a new expense with multiple payers
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* expense name */}
            <div className="space-y-2">
              <Label htmlFor="expense-name">Expense Name</Label>
              <Input
                id="expense-name"
                placeholder="Dinner, Groceries, Movie tickets, etc."
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                required
              />
            </div>

            {/* total amount */}
            <div className="space-y-2">
              <Label htmlFor="total-amount">Total Amount</Label>
              <Input
                id="total-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
            </div>

            {/* dynamic payers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Payers</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPayer}
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Payer
                </Button>
              </div>

              {payers.map((payer) => (
                <div key={payer.id} className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`payer-${payer.id}`}>Payer</Label>
                    <Select
                      value={payer.payerId}
                      onValueChange={(value) =>
                        updatePayer(payer.id, "payerId", value)
                      }
                      required
                    >
                      <SelectTrigger id={`payer-${payer.id}`}>
                        <SelectValue placeholder="Select a payer" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`amount-${payer.id}`}>Amount</Label>
                    <Input
                      id={`amount-${payer.id}`}
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={payer.amount}
                      onChange={(e) =>
                        updatePayer(payer.id, "amount", e.target.value)
                      }
                      required
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePayer(payer.id)}
                    disabled={payers.length === 1}
                    className="mb-0.5"
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}

              <div className="flex justify-between pt-2 text-sm">
                <span>Payers Total:</span>
                <span
                  className={
                    Math.abs(
                      Number.parseFloat(totalAmount || 0) - payersTotal
                    ) > 0.01
                      ? "font-medium text-red-600"
                      : "font-medium"
                  }
                >
                  ${payersTotal.toFixed(2)}
                  {totalAmount &&
                    ` / $${Number.parseFloat(totalAmount).toFixed(2)}`}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="mt-4 w-full">
              Create Expense
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
