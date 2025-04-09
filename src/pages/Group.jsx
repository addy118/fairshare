import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Plus, DollarSign, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/authProvider";

export default function GroupPage({ params }) {
  const navigate = useNavigate();
  // const { id: groupId } = params;
  const { id: groupId } = useParams();
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [balances, setBalances] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("balances");
  const [showSettlements, setShowSettlements] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    // Use dummy data instead of fetching from API
    const dummyGroup = {
      id: groupId,
      name: groupId === "1" ? "Roommates" : "Trip to Paris",
      memberCount: groupId === "1" ? 4 : 3,
      userBalance: groupId === "1" ? 35.5 : -15.25,
      totalExpenses: groupId === "1" ? 250.75 : 180.5,
    };

    const dummyBalances = [
      {
        userId: "current",
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
        balance: groupId === "1" ? 35.5 : -15.25,
        isCurrentUser: true,
      },
      {
        userId: "1",
        name: "Alice Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        balance: groupId === "1" ? -20.25 : 0,
        isCurrentUser: false,
      },
      {
        userId: "2",
        name: "Bob Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        balance: groupId === "1" ? -15.25 : 0,
        isCurrentUser: false,
      },
      {
        userId: "3",
        name: "Carol Williams",
        avatar: "/placeholder.svg?height=40&width=40",
        balance: groupId === "1" ? 0 : 0,
        isCurrentUser: false,
      },
      ...(groupId === "2"
        ? [
            {
              userId: "4",
              name: "Dave Brown",
              avatar: "/placeholder.svg?height=40&width=40",
              balance: 10.75,
              isCurrentUser: false,
            },
            {
              userId: "5",
              name: "Eve Taylor",
              avatar: "/placeholder.svg?height=40&width=40",
              balance: 4.5,
              isCurrentUser: false,
            },
          ]
        : []),
    ];

    const dummyExpenses = [
      {
        id: "e1",
        description: "Groceries",
        amount: 45.75,
        date: "2023-04-15",
        paidBy: {
          name: "John Doe",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: true,
        },
        splits: [
          {
            user: {
              name: "John Doe",
              avatar: "/placeholder.svg?height=40&width=40",
              isCurrentUser: true,
            },
            amount: 11.44,
          },
          {
            user: {
              name: "Alice Smith",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            amount: 11.44,
          },
          {
            user: {
              name: "Bob Johnson",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            amount: 11.44,
          },
          {
            user: {
              name: "Carol Williams",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            amount: 11.43,
          },
        ],
        notes: "Weekly grocery shopping",
      },
      {
        id: "e2",
        description: "Dinner",
        amount: 78.5,
        date: "2023-04-10",
        paidBy: {
          name: "Alice Smith",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        splits: [
          {
            user: {
              name: "John Doe",
              avatar: "/placeholder.svg?height=40&width=40",
              isCurrentUser: true,
            },
            amount: 19.63,
          },
          {
            user: {
              name: "Alice Smith",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            amount: 19.63,
          },
          {
            user: {
              name: "Bob Johnson",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            amount: 19.63,
          },
          {
            user: {
              name: "Carol Williams",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            amount: 19.61,
          },
        ],
        notes: "Italian restaurant",
      },
      {
        id: "e3",
        description: "Utilities",
        amount: 126.5,
        date: "2023-04-05",
        paidBy: {
          name: "Bob Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        splits: [
          {
            user: {
              name: "John Doe",
              avatar: "/placeholder.svg?height=40&width=40",
              isCurrentUser: true,
            },
            amount: 31.63,
          },
          {
            user: {
              name: "Alice Smith",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            amount: 31.63,
          },
          {
            user: {
              name: "Bob Johnson",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            amount: 31.63,
          },
          {
            user: {
              name: "Carol Williams",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            amount: 31.61,
          },
        ],
        notes: "Electricity and water",
      },
    ];

    setGroup(dummyGroup);
    setBalances(dummyBalances);
    setExpenses(dummyExpenses);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [groupId]);

  const handleSettleDebts = async () => {
    // Mock settlements data
    const dummySettlements = [
      {
        id: "s1",
        from: {
          id: "s2",
          name: "Alice Smith",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        to: { name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
        amount: 20.25,
        settled: false,
      },
      {
        id: "s2",
        from: {
          id: "s1",
          name: "Bob Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        to: { name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
        amount: 15.25,
        settled: false,
      },
    ];

    setSettlements(dummySettlements);
    setShowSettlements(true);
  };

  const handleSettleTransaction = async (settlementId) => {
    // Mark the settlement as settled
    setSettlements((prevSettlements) =>
      prevSettlements.map((settlement) =>
        settlement.id === settlementId
          ? { ...settlement, settled: true }
          : settlement
      )
    );

    // No need to refresh balances since we're using dummy data
  };

  const showDetails = (item, type) => {
    setSelectedItem({ ...item, type });
    setDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4">
      {group && (
        <>
          <div className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center">
            <h1 className="text-2xl font-bold">{group.name}</h1>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/groups/${groupId}/expense/new`)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
              <Button onClick={handleSettleDebts}>
                <DollarSign className="mr-2 h-4 w-4" />
                Settle Debts
              </Button>
            </div>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="balances">Balances</TabsTrigger>
              <TabsTrigger value="history">Expense History</TabsTrigger>
            </TabsList>

            {/* group balances tab */}
            <TabsContent value="balances" className="mt-6">
              {showSettlements ? (
                // settlements tab
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      Settlements Required
                    </h2>
                    <Button
                      variant="ghost"
                      onClick={() => setShowSettlements(false)}
                    >
                      Back to Balances
                    </Button>
                  </div>

                  {settlements.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-center">
                          No settlements needed. All balances are settled!
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {settlements.map((settlement) => (
                        <Card
                          key={settlement.id}
                          className={settlement.settled ? "opacity-50" : ""}
                        >
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {/* source */}
                                <Avatar>
                                  <AvatarImage
                                    src={settlement.from.avatar || ""}
                                    alt={settlement.from.name}
                                  />
                                  <AvatarFallback>
                                    {settlement.from.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {settlement.from.name}
                                  </span>
                                </div>

                                <span className="text-muted-foreground text-sm">
                                  owes
                                </span>

                                {/* destination */}
                                <Avatar>
                                  <AvatarFallback>
                                    {settlement.to.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {settlement.to.name}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="font-bold">
                                  ${settlement.amount.toFixed(2)}
                                </span>

                                {settlement.settled ? (
                                  <span className="flex items-center text-green-600">
                                    <Check className="mr-1 h-4 w-4" />
                                    Settled
                                  </span>
                                ) : user.id == settlement.from.id ? (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleSettleTransaction(settlement.id)
                                    }
                                  >
                                    Settle
                                  </Button>
                                ) : (
                                  " "
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // balances tab
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Group Balances</CardTitle>
                      <CardDescription>
                        Current balance for each member
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {balances.map((balance) => (
                          <li
                            key={balance.userId}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={balance.avatar || ""}
                                  alt={balance.name}
                                />
                                <AvatarFallback>
                                  {balance.name?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span>{balance.name}</span>
                              {balance.isCurrentUser && (
                                <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
                                  You
                                </span>
                              )}
                            </div>
                            {balance.balance > 0 ? (
                              <span className="font-medium text-green-600">
                                +${balance.balance.toFixed(2)}
                              </span>
                            ) : balance.balance < 0 ? (
                              <span className="font-medium text-red-600">
                                -${Math.abs(balance.balance).toFixed(2)}
                              </span>
                            ) : (
                              <span className="font-medium">$0.00</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Group Summary</CardTitle>
                      <CardDescription>
                        Overview of group expenses
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Group Expenses</span>
                          <span className="font-bold">
                            ${group.totalExpenses?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Number of Expenses</span>
                          <span className="font-bold">{expenses.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Group Members</span>
                          <span className="font-bold">{group.memberCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Your Balance</span>
                          {group.userBalance > 0 ? (
                            <span className="font-bold text-green-600">
                              +${group.userBalance.toFixed(2)}
                            </span>
                          ) : group.userBalance < 0 ? (
                            <span className="font-bold text-red-600">
                              -${Math.abs(group.userBalance).toFixed(2)}
                            </span>
                          ) : (
                            <span className="font-bold">$0.00</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* payments history tab */}
            <TabsContent value="history" className="mt-6">
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
                        {expenses.map((expense, i) => (
                          <div
                            key={expense.id}
                            onClick={() => showDetails(expense, "expense")}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={expense.paidBy.avatar || ""}
                                    alt={expense.paidBy.name}
                                  />
                                  <AvatarFallback>
                                    {expense.paidBy.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {expense.description}
                                  </div>
                                  <div className="text-muted-foreground text-sm">
                                    Paid by {expense.paidBy.name} •{" "}
                                    {new Date(
                                      expense.date
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <span className="font-bold">
                                ${expense.amount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
