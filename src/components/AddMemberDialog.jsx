import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus, Trash } from "lucide-react";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Loading from "./Loading";
import { toast } from "sonner";
import api from "@/axiosInstance";

export default function NewGroupDialog({
  newMemberOpen,
  setNewMemberOpen,
  newMembers,
  setNewMembers,
  groupId,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newMembers.length === 0) {
      toast.success("Please add at least one member to the group.");
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

      setNewMemberOpen(false);
      setNewMembers([]);
      navigate(`/groups/${groupId}`);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to add members");
    } finally {
      setIsLoading(false);
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

  return (
    <Dialog open={newMemberOpen} onOpenChange={setNewMemberOpen}>
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
            Enter username for new members you wish to add in this group.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
                <div key={member.id} className="flex items-center gap-2">
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
  );
}
