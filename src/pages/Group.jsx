import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash } from "lucide-react";
import Loading from "@/components/Loading";
import Settlements from "@/components/Settlements";
import GrpBalances from "@/components/GrpBalances";
import PaymentHistory from "@/components/PaymentHistory";
import GrpSummary from "@/components/GrpSummary";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  console.log(group?.members);

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
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (newMembers.length === 0) {
      alert("Please add at least one member to the group.");
      return;
    }

    try {
      for (const user of newMembers) {
        setIsLoading(true);
        await api.post(`/grp/${groupId}/member/new`, {
          username: user.username,
        });
        setIsLoading(false);
      }

      setNewGroupOpen(false);
      setNewMembers([]);
      navigate(`/groups/${groupId}`);
    } catch (err) {
      console.error("Failed to create a group: ", err);
    }
  };

  const addMemberField = () => {
    const newId = newMembers?.length
      ? Math.max(...newMembers.map((m) => m.id)) + 1
      : 1;
    setNewMembers([...newMembers, { id: newId, username: "" }]);
  };

  const removeMemberField = (id) => {
    setNewMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const updateMemberUsername = (id, value) => {
    setNewMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, username: value } : member
      )
    );
  };

  const handleLeaveGroup = async () => {
    try {
      setIsLoading(true);
      await api.delete(`/grp/${groupId}/member/${user.id}`);
      setIsLoading(false);
      navigate("/groups");
    } catch (err) {
      console.error("Error leaving group: ", err);
      alert("Error leaving the group ", err);
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
              {group.totalExpenses > 0 && (
                <>
                  <span>·</span>
                  <span>₹{group.totalExpenses.toFixed(2)} total</span>
                </>
              )}
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

            <Dialog open={newGroupOpen} onOpenChange={setNewGroupOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Member
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-dark border border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-gray-300">
                    Add new group members
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Enter username for new members you wish to add in this
                    group.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateGroup}>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Group members</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addMemberField}
                          className="border-gray-700 hover:bg-gray-700/70 hover:text-teal-400"
                        >
                          <Plus className="mr-1 h-4 w-4" /> Add Member
                        </Button>
                      </div>

                      {newMembers?.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2"
                        >
                          <div className="flex-1">
                            <Label
                              className="mb-3 text-gray-300"
                              htmlFor={`member-${member.id}`}
                            >
                              Username
                            </Label>
                            <Input
                              id={`member-${member.id}`}
                              placeholder="Enter username"
                              onChange={(e) =>
                                updateMemberUsername(member.id, e.target.value)
                              }
                              required
                              className="border-gray-700 bg-gray-800/50"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMemberField(member.id)}
                            disabled={newMembers.length === 1}
                            className="mt-6 hover:text-red-400"
                          >
                            <Trash className="h-4 w-4 text-red-500/90" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      type="submit"
                      className="mt-4 w-full bg-gradient-to-r from-teal-500 to-teal-400 text-white shadow-lg transition-all duration-300 hover:from-teal-400 hover:to-teal-500 hover:shadow-teal-500/25"
                    >
                      {isLoading ? (
                        <Loading action="Adding" item="member(s)" />
                      ) : (
                        "Add member(s)"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </DialogContent>
            </Dialog>

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
