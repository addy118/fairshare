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
import {
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/clerk-react";

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

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 font-sans text-white">
      <div className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/90 shadow-lg backdrop-blur-md">
        <header className="mx-auto flex h-16 items-center justify-between px-4 md:px-12 lg:h-20">
          <Logo />

          <div className="flex items-center space-x-4 text-white">
            <SignedIn>
              <Button onClick={() => navigate("groups")} variant="ghost">
                <Users className="mr-2 h-4 w-4" />
                My Groups
              </Button>

              <Dialog open={newGroupOpen} onOpenChange={setNewGroupOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Group
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-dark border border-gray-700">
                  <DialogHeader className="text-teal-400">
                    <DialogTitle>Create New Group</DialogTitle>
                    <DialogDescription>
                      Enter a name for your new expense sharing group.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateGroup}>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="group-name" className="mb-3 text-white">
                          Group Name
                        </Label>
                        <Input
                          id="group-name"
                          placeholder="Roommates, Goa Trip, etc."
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          required
                          className="border-gray-700 bg-gray-800/50"
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-white">Group members</Label>
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
                                htmlFor={`member-${member.id}`}
                                className="mb-3 text-white"
                              >
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
                        className="mt-4 w-full border-none bg-gradient-to-r from-teal-500 to-teal-400 text-white hover:from-teal-400 hover:to-teal-500"
                      >
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
            </SignedIn>

            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <Button
                  variant="ghost"
                  className="gap-2 text-white transition-colors hover:text-teal-400"
                >
                  <User className="h-5 w-5" />
                  Account
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={8}
                className="z-50 min-w-[180px] rounded-xl border border-gray-700/50 bg-gray-800/90 p-2 text-white shadow-xl backdrop-blur-md transition-all duration-200"
              >
                <SignedIn>
                  <DropdownMenuLabel className="px-2 py-1 text-sm text-gray-300">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1 bg-gray-700" />

                  <DropdownMenuItem
                    className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-sm transition-colors hover:bg-gray-700/50 hover:text-teal-400 focus:bg-gray-700/50 focus:text-teal-400 focus:outline-none"
                    asChild
                  >
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-red-300 transition-colors hover:bg-red-900/40 hover:text-red-400 focus:bg-red-900/40 focus:text-red-400 focus:outline-none">
                    <SignOutButton />
                  </DropdownMenuItem>
                </SignedIn>

                <SignedOut>
                  <DropdownMenuItem className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-sm transition-colors hover:bg-gray-700/50 hover:text-teal-400 focus:bg-gray-700/50 focus:text-teal-400 focus:outline-none">
                    {/* <SignInButton /> */}
                    <Link to="/login">Sign In</Link>
                  </DropdownMenuItem>

                  {/* <DropdownMenuItem className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-sm transition-colors hover:bg-gray-700/50 hover:text-teal-400 focus:bg-gray-700/50 focus:text-teal-400 focus:outline-none">
                    <SignInButton />
                  </DropdownMenuItem> */}
                </SignedOut>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      </div>

      <div className="flex-1 py-16">
        <Outlet />
      </div>

      <footer className="relative overflow-hidden border-t border-gray-800 bg-gray-900/80 px-6 py-6 backdrop-blur-sm md:py-8">
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center text-sm text-gray-500">
            <p>© {currentYear} FairShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
