import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dot, Plus, Trash } from "lucide-react";
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

  const [activeTab, setActiveTab] = useState("overview");
  const [newMembers, setNewMembers] = useState([""]);
  const [newMemberOpen, setNewMemberOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNewMembers([""]);
  }, [newMemberOpen]);

  const handleLeaveGroup = async () => {
    try {
      setIsLoading(true);
      await api.delete(`/grp/${groupId}/member/${user.id}`);
      setIsLoading(false);
      navigate("/groups");
    } catch (error) {
      console.error("Error leaving group: ", error);
      toast.success("Error leaving the group ", error);
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
      <div className="flex min-h-[200px] items-center justify-center px-4">
        <p className="text-center text-red-500">
          Error loading group: {groupError.message}
        </p>
      </div>
    );
  }

  // show not found state
  if (!group) {
    return (
      <div className="flex min-h-[200px] items-center justify-center px-4">
        <p className="text-center text-gray-500">Group not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="glass-dark mb-6 rounded-sm border border-gray-700/50 p-4 shadow-lg sm:mb-8 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-center text-center lg:text-left">
            <h1 className="gradient-text text-xl font-bold sm:text-2xl lg:text-3xl">
              {group.name}
            </h1>
            <Dot />
            <p className="text-[#d3d3d3]">{group?.members?.length} Members</p>
          </div>

          <div className="flex w-full flex-row gap-2 sm:gap-3 lg:w-auto">
            <Button
              variant="outline"
              onClick={() => navigate(`/groups/${groupId}/expense/new`)}
              className="h-8 flex-1 rounded-sm border-gray-700 text-xs hover:bg-gray-700/70 hover:text-teal-400 lg:h-10 lg:flex-none lg:text-base"
            >
              <Plus className="h-4 w-4" />
              Expense
            </Button>

            <div className="flex-1 lg:flex-none">
              <NewGroupDialog
                newMemberOpen={newMemberOpen}
                setNewMemberOpen={setNewMemberOpen}
                newMembers={newMembers}
                setNewMembers={setNewMembers}
                groupId={groupId}
              />
            </div>

            <Button
              variant="destructive"
              onClick={handleLeaveGroup}
              className="h-8 flex-1 rounded-sm text-xs lg:h-10 lg:flex-none lg:text-base"
            >
              <Trash className="h-4 w-4" />
              {isLoading ? (
                <Loading action="Leaving" item="group" />
              ) : (
                "Leave Group"
              )}
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full rounded-sm"
      >
        <TabsList className="glass-dark grid w-full grid-cols-3 rounded-sm p-1">
          <TabsTrigger
            value="overview"
            className="text-white-800 text-xs data-[state=active]:bg-gray-700/70 data-[state=active]:text-teal-400 sm:text-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="settlements"
            className="text-white-800 text-xs data-[state=active]:bg-gray-700/70 data-[state=active]:text-teal-400 sm:text-sm"
          >
            Settle Debts
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="text-white-800 text-xs data-[state=active]:bg-gray-700/70 data-[state=active]:text-teal-400 sm:text-sm"
          >
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 sm:mt-6">
          <div className="mb-20 grid gap-4 sm:gap-6 lg:grid-cols-2">
            <GrpBalances />
            <GrpSummary />
          </div>
        </TabsContent>

        <TabsContent value="settlements" className="mt-4 sm:mt-6">
          <Settlements />
        </TabsContent>

        <TabsContent value="history" className="mt-4 sm:mt-6">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
