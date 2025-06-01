import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
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
import Loading from "@/components/Loading";
import { useSelector } from "react-redux";
import { selectCurrentGroup } from "@/store/slices/groupSlice";
import {
  useGetGroupInfoQuery,
  useCreateExpenseMutation,
} from "@/store/api/apiSlice";

export default function ExpenseForm() {
  const navigate = useNavigate();
  const { id: groupId } = useParams();

  // Use RTK Query hooks
  const { data: group } = useGetGroupInfoQuery(groupId);
  const [createExpense, { isLoading }] = useCreateExpenseMutation();

  const users = group?.members || [];

  const [expenseName, setExpenseName] = useState("Demo Expense");
  const [totalAmount, setTotalAmount] = useState("50");

  const initExpense = [
    {
      id: Date.now(),
      payerId: "user_29w83sxmDNGwOuEthce5gg56FcC",
      amount: "50",
    },
    {
      id: Date.now() + 1,
      payerId: "user_2xr6Vz2hPcAvh0HmMGacSHaBwsm",
      amount: "0",
    },
  ];
  const [payers, setPayers] = useState([]);
  const [payersTotal, setPayersTotal] = useState(50);

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

  const handleCreateExpense = async (expense) => {
    try {
      await createExpense(expense).unwrap();
      alert("Expense submitted successfully!");
      navigate(`/groups/${Number(groupId)}`);
    } catch (err) {
      console.error("Failed to create an expense: ", err);
      alert("Failed to create expense: " + err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!expenseName.trim()) {
      alert("Please enter an expense name");
      return;
    }

    if (!totalAmount || Number.parseFloat(totalAmount) < 0) {
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
        `Payer amounts total (${payersTotal.toFixed(2)}) doesn't match expense total (${Number.parseFloat(
          totalAmount
        ).toFixed(2)})`
      );
      return;
    }

    const expense = {
      name: expenseName,
      totalAmt: Number.parseFloat(totalAmount),
      payers: payers.map(({ payerId, amount }) => ({
        payerId: payerId,
        amount: Number.parseFloat(amount),
      })),
      groupId,
    };
    console.log(expense);

    handleCreateExpense(expense);
  };

  return (
    <div className="mx-auto mb-20 max-w-xl px-4">
      <h1 className="gradient-text mb-4 text-2xl font-bold text-teal-400">
        Create Expense
      </h1>

      <Card className="glass-dark border border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardDescription className="text-gray-300">
            Add a new expense with multiple participants
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* expense name */}
            <div className="space-y-2">
              <Label className="text-white" htmlFor="expense-name">
                Expense Name
              </Label>
              <Input
                id="expense-name"
                placeholder="Dinner, Groceries, Movie tickets, etc."
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                required
                className="border-gray-700 bg-gray-800/50"
              />
            </div>

            {/* total amount */}
            <div className="space-y-2">
              <Label className="text-white" htmlFor="total-amount">
                Total Amount
              </Label>
              <Input
                id="total-amount"
                type="number"
                step="1"
                min="0"
                placeholder="0"
                value={totalAmount}
                className="appearance-none border-gray-700 bg-gray-800/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
            </div>

            {/* dynamic payers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white">Participants</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPayer}
                  className=""
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Participant
                </Button>
              </div>

              {payers.map((payer) => (
                <div key={payer.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label
                      className="mb-3 text-white"
                      htmlFor={`payer-${payer.id}`}
                    >
                      Participant
                    </Label>
                    <div className="mt-1">
                      <Select
                        value={payer.payerId}
                        onValueChange={(value) =>
                          updatePayer(payer.id, "payerId", value)
                        }
                        required
                      >
                        <SelectTrigger
                          id={`payer-${payer.id}`}
                          className="border-gray-700 bg-gray-800/50 text-teal-600"
                        >
                          <SelectValue placeholder="Select a participant" />
                        </SelectTrigger>
                        <SelectContent className="glass-dark border border-gray-700/50">
                          {users.map((user) => (
                            <SelectItem
                              key={user.id}
                              value={user.id.toString()}
                              className="text-teal-400"
                            >
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex-1">
                    <Label
                      className="mb-3 text-white"
                      htmlFor={`amount-${payer.id}`}
                    >
                      Amount
                    </Label>
                    <Input
                      id={`amount-${payer.id}`}
                      type="number"
                      step="1"
                      min="0"
                      placeholder="0"
                      value={payer.amount}
                      onChange={(e) =>
                        updatePayer(payer.id, "amount", e.target.value)
                      }
                      required
                      className="appearance-none border-gray-700 bg-gray-800/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePayer(payer.id)}
                    disabled={payers.length === 1}
                    className="mt-6 hover:text-red-400"
                  >
                    <Trash className="h-4 w-4 text-red-500/90" />
                  </Button>
                </div>
              ))}

              <div className="flex justify-between pt-2 text-sm">
                <span className="text-gray-300">Participants Total:</span>
                <span
                  className={
                    Math.abs(
                      Number.parseFloat(totalAmount || 0) - payersTotal
                    ) > 0.01
                      ? "font-medium text-red-500/90"
                      : "font-medium text-teal-400"
                  }
                >
                  ₹{payersTotal.toFixed(2)}
                  {totalAmount &&
                    ` / ₹${Number.parseFloat(totalAmount).toFixed(2)}`}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-gradient-to-r from-teal-500 to-teal-400 text-white shadow-lg transition-all duration-300 hover:from-teal-400 hover:to-teal-500 hover:shadow-teal-500/25"
            >
              {isLoading ? (
                <Loading action="Creating" item="expense" />
              ) : (
                "Create Expense"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
