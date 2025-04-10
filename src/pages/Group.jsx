import React, { useState, useEffect, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, IndianRupee } from "lucide-react";
import Loading from "@/components/Loading";
import Settlements from "@/components/Settlements";
import GrpBalances from "@/components/GrpBalances";
import PaymentHistory from "@/components/PaymentHistory";
import useGroupData from "@/utils/useGroup";

export const GroupContext = createContext({
  group: null,
  expenses: [],
  settlments: [],
  balances: [],
  history: [],
  selectedItem: null,
  detailsOpen: false,
  setSettlements: () => {},
  setSelectedItem: () => {},
  setDetailsOpen: () => {},
});

export default function GroupPage({ params }) {
  const navigate = useNavigate();
  const { id: groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [balances, setBalances] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [history, setHistory] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [showSettlements, setShowSettlements] = useState(false);
  const [activeTab, setActiveTab] = useState("balances");

  // useEffect(() => {
  //   // Use dummy data instead of fetching from API
  //   const dummyGroup = {
  //     id: groupId,
  //     name: groupId === "1" ? "Roommates" : "Trip to Paris",
  //     memberCount: groupId === "1" ? 4 : 3,
  //     userBalance: groupId === "1" ? 35.5 : -15.25,
  //     totalExpenses: groupId === "1" ? 250.75 : 180.5,
  //   };

  //   // append isCurrUser prop in api fetch of
  //   // split created at, keep date as it is, convert time to local
  //   // grp/:grpId/balance
  //   const dummyBalances = [
  //     {
  //       userId: "current",
  //       name: "John Doe",
  //       avatar: "/placeholder.svg?height=40&width=40",
  //       balance: groupId === "1" ? 35.5 : -15.25,
  //       isCurrentUser: true,
  //     },
  //     {
  //       userId: "1",
  //       name: "Alice Smith",
  //       avatar: "/placeholder.svg?height=40&width=40",
  //       balance: groupId === "1" ? -20.25 : 0,
  //       isCurrentUser: false,
  //     },
  //     {
  //       userId: "2",
  //       name: "Bob Johnson",
  //       avatar: "/placeholder.svg?height=40&width=40",
  //       balance: groupId === "1" ? -15.25 : 0,
  //       isCurrentUser: false,
  //     },
  //     {
  //       userId: "3",
  //       name: "Carol Williams",
  //       avatar: "/placeholder.svg?height=40&width=40",
  //       balance: groupId === "1" ? 0 : 0,
  //       isCurrentUser: false,
  //     },
  //     ...(groupId === "2"
  //       ? [
  //           {
  //             userId: "4",
  //             name: "Dave Brown",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //             balance: 10.75,
  //             isCurrentUser: false,
  //           },
  //           {
  //             userId: "5",
  //             name: "Eve Taylor",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //             balance: 4.5,
  //             isCurrentUser: false,
  //           },
  //         ]
  //       : []),
  //   ];

  //   // append isCurrUser prop to res[i].expense.payers[i]
  //   // append splits array indicating equal share of amount paid
  //   // grp/:grpId/expenses
  //   const dummyExpenses = [
  //     {
  //       id: "e1",
  //       description: "Groceries",
  //       amount: 45.75,
  //       date: "2023-04-15",
  //       paidBy: {
  //         name: "John Doe",
  //         avatar: "/placeholder.svg?height=40&width=40",
  //         isCurrentUser: true,
  //       },
  //       splits: [
  //         {
  //           user: {
  //             name: "John Doe",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //             isCurrentUser: true,
  //           },
  //           amount: 11.44,
  //         },
  //         {
  //           user: {
  //             name: "Alice Smith",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //           },
  //           amount: 11.44,
  //         },
  //         {
  //           user: {
  //             name: "Bob Johnson",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //           },
  //           amount: 11.44,
  //         },
  //         {
  //           user: {
  //             name: "Carol Williams",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //           },
  //           amount: 11.43,
  //         },
  //       ],
  //       notes: "Weekly grocery shopping",
  //     },
  //     {
  //       id: "e2",
  //       description: "Dinner",
  //       amount: 78.5,
  //       date: "2023-04-10",
  //       paidBy: {
  //         name: "Alice Smith",
  //         avatar: "/placeholder.svg?height=40&width=40",
  //         isCurrentUser: false,
  //       },
  //       splits: [
  //         {
  //           user: {
  //             name: "John Doe",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //             isCurrentUser: true,
  //           },
  //           amount: 19.63,
  //         },
  //         {
  //           user: {
  //             name: "Alice Smith",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //           },
  //           amount: 19.63,
  //         },
  //         {
  //           user: {
  //             name: "Bob Johnson",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //           },
  //           amount: 19.63,
  //         },
  //         {
  //           user: {
  //             name: "Carol Williams",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //           },
  //           amount: 19.61,
  //         },
  //       ],
  //       notes: "Italian restaurant",
  //     },
  //     {
  //       id: "e3",
  //       description: "Utilities",
  //       amount: 126.5,
  //       date: "2023-04-05",
  //       paidBy: {
  //         name: "Bob Johnson",
  //         avatar: "/placeholder.svg?height=40&width=40",
  //         isCurrentUser: false,
  //       },
  //       splits: [
  //         {
  //           user: {
  //             name: "John Doe",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //             isCurrentUser: true,
  //           },
  //           amount: 31.63,
  //         },
  //         {
  //           user: {
  //             name: "Alice Smith",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //           },
  //           amount: 31.63,
  //         },
  //         {
  //           user: {
  //             name: "Bob Johnson",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //           },
  //           amount: 31.63,
  //         },
  //         {
  //           user: {
  //             name: "Carol Williams",
  //             avatar: "/placeholder.svg?height=40&width=40",
  //           },
  //           amount: 31.61,
  //         },
  //       ],
  //       notes: "Electricity and water",
  //     },
  //   ];

  //   // exactly as it is
  //   const dummyHistory = [
  //     {
  //       type: "expense",
  //       timestamp: "2025-04-08T03:31:34.395Z",
  //       id: 1,
  //       name: "exp1",
  //       totalAmt: 250,
  //       createdAt: "2025-04-08T03:31:34.395Z",
  //       payers: [
  //         { payer: { id: 4, name: "Dumbledore" }, paidAmt: 50 },
  //         { payer: { id: 3, name: "Hagrid" }, paidAmt: 0 },
  //         { payer: { id: 2, name: "Hermione" }, paidAmt: 200 },
  //       ],
  //       balance: [
  //         { user: { id: 1, name: "Harry" }, amount: 0 },
  //         { user: { id: 2, name: "Hermione" }, amount: 117 },
  //         { user: { id: 3, name: "Hagrid" }, amount: -83 },
  //         { user: { id: 4, name: "Dumbledore" }, amount: -33 },
  //         { user: { id: 5, name: "Voldemort" }, amount: 0 },
  //       ],
  //     },
  //     {
  //       type: "expense",
  //       timestamp: "2025-04-08T03:31:51.221Z",
  //       id: 2,
  //       name: "exp2",
  //       totalAmt: 50,
  //       createdAt: "2025-04-08T03:31:51.221Z",
  //       payers: [
  //         { payer: { id: 3, name: "Hagrid" }, paidAmt: 50 },
  //         { payer: { id: 2, name: "Hermione" }, paidAmt: 0 },
  //       ],
  //       balance: [
  //         { user: { id: 1, name: "Harry" }, amount: 0 },
  //         { user: { id: 2, name: "Hermione" }, amount: 92 },
  //         { user: { id: 3, name: "Hagrid" }, amount: -58 },
  //         { user: { id: 4, name: "Dumbledore" }, amount: -33 },
  //         { user: { id: 5, name: "Voldemort" }, amount: 0 },
  //       ],
  //     },
  //     {
  //       type: "expense",
  //       timestamp: "2025-04-08T03:32:55.848Z",
  //       id: 3,
  //       name: "exp3",
  //       totalAmt: 290,
  //       createdAt: "2025-04-08T03:32:55.848Z",
  //       payers: [
  //         { payer: { id: 1, name: "Harry" }, paidAmt: 60 },
  //         { payer: { id: 5, name: "Voldemort" }, paidAmt: 100 },
  //         { payer: { id: 4, name: "Dumbledore" }, paidAmt: 80 },
  //         { payer: { id: 3, name: "Hagrid" }, paidAmt: 40 },
  //         { payer: { id: 2, name: "Hermione" }, paidAmt: 10 },
  //       ],
  //       balance: [
  //         { user: { id: 1, name: "Harry" }, amount: 2 },
  //         { user: { id: 2, name: "Hermione" }, amount: 44 },
  //         { user: { id: 3, name: "Hagrid" }, amount: -76 },
  //         { user: { id: 4, name: "Dumbledore" }, amount: -11 },
  //         { user: { id: 5, name: "Voldemort" }, amount: 42 },
  //       ],
  //     },
  //     {
  //       type: "expense",
  //       timestamp: "2025-04-08T03:33:11.284Z",
  //       id: 4,
  //       name: "exp4",
  //       totalAmt: 60,
  //       createdAt: "2025-04-08T03:33:11.284Z",
  //       payers: [
  //         { payer: { id: 1, name: "Harry" }, paidAmt: 10 },
  //         { payer: { id: 4, name: "Dumbledore" }, paidAmt: 20 },
  //         { payer: { id: 3, name: "Hagrid" }, paidAmt: 30 },
  //       ],
  //       balance: [
  //         { user: { id: 1, name: "Harry" }, amount: -8 },
  //         { user: { id: 2, name: "Hermione" }, amount: 44 },
  //         { user: { id: 3, name: "Hagrid" }, amount: -66 },
  //         { user: { id: 4, name: "Dumbledore" }, amount: -11 },
  //         { user: { id: 5, name: "Voldemort" }, amount: 42 },
  //       ],
  //     },
  //   ];

  //   // setHistory(dummyHistory);

  //   // setGroup(dummyGroup);
  //   // setBalances(dummyBalances);
  //   // setExpenses(dummyExpenses);
  //   setIsLoading(false);
  // }, [groupId]);

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

  const {
    group: grp,
    balances: bal,
    expenses: exp,
    history: hist,
    loading,
    error,
  } = useGroupData(1);

  useEffect(() => {
    setGroup(grp);
    setBalances(bal);
    setExpenses(exp);
    setHistory(hist);

    // if (loading) setIsLoading(loading);
  }, [grp, bal, exp, hist, loading]);

  if (error) console.log(error);
  if (loading) return <Loading item="group" />;

  return (
    <GroupContext.Provider
      value={{
        settlements,
        setSettlements,
        balances,
        group,
        expenses,
        history,
        selectedItem,
        setSelectedItem,
        detailsOpen,
        setDetailsOpen,
      }}
    >
      <div className="mx-auto max-w-4xl px-4">
        {group && (
          <>
            {/* group header */}
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
                  <IndianRupee className="mr-2 h-4 w-4" />
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
                <TabsTrigger value="history">Payments History</TabsTrigger>
              </TabsList>

              {/* group balances tab */}
              <TabsContent value="balances" className="mt-6">
                {showSettlements ? <Settlements /> : <GrpBalances />}
              </TabsContent>

              {/* payments history tab */}
              <TabsContent value="history" className="mt-6">
                <PaymentHistory />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </GroupContext.Provider>
  );
}
