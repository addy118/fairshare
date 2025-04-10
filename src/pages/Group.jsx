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
import GrpSummary from "@/components/GrpSummary";

export const GroupContext = createContext({
  group: {},
  expenses: [],
  settlments: [],
  balances: [],
  history: [],
  setGroup: () => {},
  setBalances: () => {},
  setExpenses: () => {},
  setSettlements: () => {},
  setHistory: () => {},
  selectedItem: null,
  detailsOpen: false,
  setSelectedItem: () => {},
  setDetailsOpen: () => {},
});

export default function GroupPage() {
  const navigate = useNavigate();
  const { id: groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [balances, setBalances] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [history, setHistory] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("balances");

  // fetch group related data from api
  const {
    group: grp,
    balances: bal,
    expenses: exp,
    settlements: stlment,
    history: hist,
    loading,
    error,
  } = useGroupData(Number(groupId));

  useEffect(() => {
    setGroup(grp);
    setBalances(bal);
    setExpenses(exp);
    setSettlements(stlment);
    setHistory(hist);
  }, [grp, bal, exp, hist, loading]);

  if (error) console.log(error);
  if (loading) return <Loading item="group" />;

  return (
    <GroupContext.Provider
      value={{
        settlements,
        setSettlements,
        balances,
        setBalances,
        group,
        setGroup,
        expenses,
        setExpenses,
        history,
        setHistory,
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
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="balances">Balances</TabsTrigger>
                <TabsTrigger value="settlements">Settle Debts</TabsTrigger>
                <TabsTrigger value="history">Payments History</TabsTrigger>
              </TabsList>

              {/* group balances tab */}
              <TabsContent value="balances" className="mt-6">
                <div className="mb-20 grid gap-6 md:grid-cols-2">
                  <GrpBalances />
                  <GrpSummary />
                </div>
              </TabsContent>

              {/* settle debts tab */}
              <TabsContent value="settlements" className="mt-6">
                <Settlements />
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
