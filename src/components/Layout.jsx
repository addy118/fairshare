import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Users, PlusCircle, Trash, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/authProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import api from "@/axiosInstance";
import { CardContent, CardFooter } from "./ui/card";
import Loading from "./Loading";
import Logo from "./Logo";

export default function Layout() {
  const navigate = useNavigate();
  const { user, isAuth, logout } = useAuth();

  const [newGroupName, setNewGroupName] = useState("");
  const [newMembers, setNewMembers] = useState([]);
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      alert("Group name cannot be empty.");
      return;
    }
    if (newMembers.length === 0) {
      alert("Please add at least one member to the group.");
      return;
    }

    const updatedUsers = [
      ...newMembers,
      { id: user.id, username: user.username },
    ];
    setNewMembers(updatedUsers);

    try {
      setLoading(true);
      const groupRes = await api.post(`/grp/new`, { name: newGroupName });
      for (const user of updatedUsers) {
        await api.post(`/grp/${groupRes.data.group.id}/member/new`, {
          username: user.username,
        });
      }
      setLoading(false);
      setNewGroupOpen(false);
      setNewGroupName("");
      setNewMembers([]);
      navigate("/groups");
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

  return (
    <div className="flex min-h-screen flex-col bg-[#0f1728]">
      <div className="sticky top-0 z-50 w-full border-b border-[#0f1728] bg-gray-900/90 shadow-lg backdrop-blur-md">
        <header className="mx-auto flex h-16 items-center justify-between px-4 md:px-12 lg:h-20">
          <Logo />

          <div className="flex items-center space-x-4 text-white">
            {isAuth && (
              <Button
                onClick={() => navigate("groups")}
                variant="ghost"
                className="hover:text-teal-400"
              >
                <Users className="mr-2 h-4 w-4" />
                My Groups
              </Button>
            )}

            {isAuth && (
              <Dialog open={newGroupOpen} onOpenChange={setNewGroupOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="hover:text-teal-400">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                    <DialogDescription>
                      Enter a name for your new expense sharing group.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateGroup}>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="group-name">Group Name</Label>
                        <Input
                          id="group-name"
                          placeholder="Roommates, Goa Trip, etc."
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Group members</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addMemberField}
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
                              <Label htmlFor={`member-${member.id}`}>
                                Username
                              </Label>
                              <Input
                                id={`member-${member.id}`}
                                placeholder="Enter username"
                                onChange={(e) =>
                                  updateMemberUsername(
                                    member.id,
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMemberField(member.id)}
                              disabled={newMembers.length === 1}
                              className="mt-6"
                            >
                              <Trash className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="mt-4 w-full">
                        {loading ? (
                          <Loading action="Creating" item="group" />
                        ) : (
                          "Create Group"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <Button variant="ghost" className="hover:text-teal-400">
                  <User className="h-5 w-5" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={8}
                className="rounded-md border bg-white shadow-md"
              >
                {isAuth ? (
                  <>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link to={"/profile"}>
                      <DropdownMenuItem className="cursor-pointer">
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={logout}>
                      Log Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <Link to={`/login`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Login
                      </DropdownMenuItem>
                    </Link>
                    <Link to={`/signup`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Register
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      </div>
      <div className="flex-1 bg-[#0f1728] py-16">
        <Outlet />
      </div>
    </div>
  );
}
