import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash } from "lucide-react";
import Loading from "@/components/Loading";
import Settlements from "@/components/Settlements";
import GrpBalances from "@/components/GrpBalances";
import PaymentHistory from "@/components/PaymentHistory";
import GrpSummary from "@/components/GrpSummary";
import api from "@/axiosInstance";
import { useUser } from "@clerk/clerk-react";
import formatUser from "@/utils/formatUser";
import {
  useGetGroupInfoQuery,
  useGetGroupBalancesQuery,
  useGetGroupExpensesQuery,
  useGetGroupSettlementsQuery,
  useGetGroupHistoryQuery,
} from "@/store/api/apiSlice";
import NewGroupDialog from "@/components/AddMemberDialog";
import { toast } from "sonner";

export default function GroupPage() {
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();
  const user = formatUser(clerkUser);
  const { id: groupId } = useParams();

  // RTK Query hooks with proper skip conditions
  const {
    data: group,
    isLoading: isLoadingGroup,
    error: groupError,
  } = useGetGroupInfoQuery(groupId, {
    skip: !groupId,
  });
  // console.log(group?.members);

  const { isLoading: isLoadingBalances } = useGetGroupBalancesQuery(
    { groupId },
    { skip: !groupId }
  );

  const { isLoading: isLoadingExpenses } = useGetGroupExpensesQuery(groupId, {
    skip: !groupId,
  });

  const { isLoading: isLoadingSettlements } = useGetGroupSettlementsQuery(
    groupId,
    { skip: !groupId }
  );

  const { isLoading: isLoadingHistory } = useGetGroupHistoryQuery(groupId, {
    skip: !groupId,
  });

  const [activeTab, setActiveTab] = useState("balances");
  const [newMembers, setNewMembers] = useState([]);
  const [newMemberOpen, setNewMemberOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLeaveGroup = async () => {
    try {
      setIsLoading(true);
      await api.delete(`/grp/${groupId}/member/${user.id}`);
      setIsLoading(false);
      navigate("/groups");
    } catch (err) {
      console.error("Error leaving group: ", err);
      toast.success("Error leaving the group ", err);
    }
  };

  // show loading state while initial data is being fetched
  if (
    isLoadingGroup ||
    isLoadingBalances ||
    isLoadingExpenses ||
    isLoadingSettlements ||
    isLoadingHistory ||
    !user
  ) {
    return <Loading item="group" />;
  }

  // show error state
  if (groupError) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-red-500">
          Error loading group: {groupError.message}
        </p>
      </div>
    );
  }

  // show not found state
  if (!group) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-gray-500">Group not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4">
      <div className="glass-dark mb-8 rounded-lg border border-gray-700/50 p-6 shadow-lg">
        <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="gradient-text text-2xl font-bold">{group.name}</h1>
            <div className="flex items-center gap-2 text-gray-300">
              <span>{group.memberCount} members</span>
              <span>·</span>
              <span>{group.expenses.length} expenses</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/groups/${groupId}/expense/new`)}
              className="border-gray-700 hover:bg-gray-700/70 hover:text-teal-400"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>

            <NewGroupDialog
              newMemberOpen={newMemberOpen}
              setNewMemberOpen={setNewMemberOpen}
              newMembers={newMembers}
              setNewMembers={setNewMembers}
              groupId={groupId}
            />

            <Button
              variant="destructive"
              onClick={handleLeaveGroup}
              className="hover:bg-red-600/90"
            >
              <Trash className="mr-2 h-4 w-4" />
              {isLoading ? (
                <Loading action="Leaving" item="group" />
              ) : (
                "Leave Group"
              )}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass-dark grid w-full grid-cols-3 rounded-lg p-1">
          <TabsTrigger
            value="balances"
            className="text-white-800 data-[state=active]:bg-gray-700/70 data-[state=active]:text-teal-400"
          >
            Balances
          </TabsTrigger>
          <TabsTrigger
            value="settlements"
            className="text-white-800 data-[state=active]:bg-gray-700/70 data-[state=active]:text-teal-400"
          >
            Settle Debts
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="text-white-800 data-[state=active]:bg-gray-700/70 data-[state=active]:text-teal-400"
          >
            Payments History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balances" className="mt-6">
          <div className="mb-20 grid gap-6 md:grid-cols-2">
            <GrpBalances />
            <GrpSummary />
          </div>
        </TabsContent>

        <TabsContent value="settlements" className="mt-6">
          <Settlements />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
