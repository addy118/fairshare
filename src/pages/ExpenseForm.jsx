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
import {
  useGetGroupInfoQuery,
  useCreateExpenseMutation,
} from "@/store/api/apiSlice";
import { toast } from "sonner";

export default function ExpenseForm() {
  const navigate = useNavigate();
  const { id: groupId } = useParams();

  // Use RTK Query hooks
  const { data: group } = useGetGroupInfoQuery(groupId);
  const [createExpense, { isLoading }] = useCreateExpenseMutation();

  const users = group?.members || [];

  const [expenseName, setExpenseName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  const [payers, setPayers] = useState([
    { id: Date.now(), payerId: "", amount: "0" },
    { id: Date.now() + 18, payerId: "", amount: "0" },
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
    setPayers([...payers, { id: Date.now(), payerId: "", amount: "0" }]);
  };

  const addAll = () => {
    const allMembers = [];

    users.forEach((user, i) => {
      allMembers.push({ id: Date.now() + i, payerId: user.id, amount: "0" });
    });

    setPayers([...allMembers]);
  };

  const removePayer = (id) => {
    if (payers.length > 2) {
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
      toast.success("Expense created successfully!");
      navigate(`/groups/${Number(groupId)}`);
    } catch (error) {
      console.log(error.response?.data?.message);
      console.log(error.message);
      toast.error(error.response?.data?.message || "Failed to create expense.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!expenseName.trim()) {
      toast.error("Please enter an expense name");
      return;
    }

    if (!totalAmount || Number.parseFloat(totalAmount) < 0) {
      toast.error("Please enter a valid total amount.");
      return;
    }

    const invalidPayers = payers.some(
      (payer) => !payer.payerId || !payer.amount
    );
    if (invalidPayers) {
      toast.error("Please fill in all payer details.");
      return;
    }

    if (payers.length < 2) {
      toast.error("Please add at least two participants.");
      return;
    }

    if (payers.length > users.length) {
      toast.error("Please remove duplicate participants and retry.");
      return;
    }

    const payerIds = payers.map((payer) => payer.payerId);
    const hasDuplicates = new Set(payerIds).size !== payerIds.length;
    if (hasDuplicates) {
      toast.error("Please remove duplicate participants and retry.");
      return;
    }

    if (Math.abs(Number.parseFloat(totalAmount) - payersTotal) > 0.01) {
      toast.error(
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

    await handleCreateExpense(expense);
    navigate(`/groups/${groupId}`);
  };

  return (
    <div className="mx-auto mb-20 max-w-2xl px-4 sm:px-6 lg:px-8">
      <h1 className="gradient-text mb-4 text-xl font-bold text-[#00bcff] sm:mb-6 sm:text-2xl">
        Create Expense
      </h1>

      <Card className="glass-dark border border-gray-700/50 shadow-lg">
        <CardHeader className="pb-4 sm:pb-6">
          <CardDescription className="text-sm text-gray-300 sm:text-base">
            Add a new expense with multiple participants
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* expense name */}
            <div className="space-y-2">
              <Label
                className="text-sm text-white sm:text-base"
                htmlFor="expense-name"
              >
                Expense Name
              </Label>
              <Input
                id="expense-name"
                placeholder="Dinner, Groceries, Movie tickets, etc."
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                required
                className="border-gray-700 bg-gray-800/50 text-sm sm:text-base"
              />
            </div>

            {/* total amount */}
            <div className="space-y-2">
              <Label
                className="text-sm text-white sm:text-base"
                htmlFor="total-amount"
              >
                Total Amount
              </Label>
              <Input
                id="total-amount"
                type="number"
                step="1"
                min="0"
                placeholder="0"
                value={totalAmount}
                className="appearance-none border-gray-700 bg-gray-800/50 text-sm sm:text-base [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
            </div>

            {/* dynamic payers */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Label className="text-sm text-white sm:text-base">
                  Participants
                </Label>

                <div className="flex w-full flex-row gap-1 sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAll}
                    className="w-full flex-1 text-xs sm:w-auto sm:flex-none sm:text-sm"
                  >
                    <Plus className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Add All
                    Members
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPayer}
                    className="w-full flex-1 text-xs sm:w-auto sm:flex-none sm:text-sm"
                  >
                    <Plus className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Add
                    Participant
                  </Button>
                </div>
              </div>

              {payers.map((payer) => (
                <div
                  key={payer.id}
                  className="flex items-end gap-2 sm:items-end sm:gap-2"
                >
                  {/* participant */}
                  <div className="min-w-0 flex-1">
                    <Label
                      className="mb-2 block text-sm text-white sm:text-base"
                      htmlFor={`payer-${payer.id}`}
                    >
                      Participant
                    </Label>
                    <Select
                      value={payer.payerId}
                      onValueChange={(value) =>
                        updatePayer(payer.id, "payerId", value)
                      }
                      required
                    >
                      <SelectTrigger
                        id={`payer-${payer.id}`}
                        className="truncate border-gray-700 bg-gray-800/50 text-sm text-teal-600 sm:text-base"
                      >
                        <SelectValue
                          placeholder="Select a participant"
                          className="truncate"
                        />
                      </SelectTrigger>
                      <SelectContent className="glass-dark border border-gray-700/50">
                        {users.map((user) => (
                          <SelectItem
                            key={user.id}
                            value={user.id.toString()}
                            className="truncate text-sm text-[#00bcff] sm:text-base"
                          >
                            <span className="block truncate">{user.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* amount */}
                  <div className="w-24 sm:flex-1">
                    <Label
                      className="mb-2 block text-sm text-white sm:text-base"
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
                      className="appearance-none border-gray-700 bg-gray-800/50 text-sm sm:text-base [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>

                  {/* delete button */}
                  <div className="flex-shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePayer(payer.id)}
                      disabled={payers.length <= 2}
                      className="hover:text-red-400 sm:mb-0"
                    >
                      <Trash className="h-4 w-4 text-red-500/90" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between border-t border-gray-700 pt-3 text-xs sm:text-sm">
                <span className="text-gray-300">Participants Total:</span>
                <span
                  className={
                    Math.abs(
                      Number.parseFloat(totalAmount || 0) - payersTotal
                    ) > 0.01
                      ? "font-medium text-red-500/90"
                      : "font-medium text-[#00bcff]"
                  }
                >
                  ₹{payersTotal.toFixed(2)}
                  {totalAmount &&
                    ` / ₹${Number.parseFloat(totalAmount).toFixed(2)}`}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-4 sm:pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-gradient-to-r from-[#00a2ff] to-[#00bcff] text-sm text-white shadow-lg transition-all duration-300 hover:from-[#00bcff] hover:to-[#00a2ff] hover:shadow-[#00a2ff]/25 sm:text-base"
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
