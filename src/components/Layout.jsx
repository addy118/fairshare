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
      console.log(`creating group ${newGroupName}...`);
      setLoading(true);
      const groupRes = await api.post(`/grp/new`, { name: newGroupName });
      console.log(groupRes.data.group.id);

      // console.log(updatedUsers); // [{ id, username }, {...}, ...]
      console.log("adding members to new group...");
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

  // create empty member field with empty username
  const addMemberField = () => {
    const newId = newMembers?.length
      ? Math.max(...newMembers.map((m) => m.id)) + 1
      : 1;
    setNewMembers([...newMembers, { id: newId, username: "" }]);
  };

  const removeMemberField = (id) => {
    setNewMembers((prev) => prev.filter((member) => member.id !== id));
  };

  // fill the empty username
  const updateMemberUsername = (id, value) => {
    setNewMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, username: value } : member
      )
    );
  };

  return (
    <>
      <div className="bg-background mb-6">
        <header className="border-b">
          <div className="max-w-8xl mx-auto flex h-16 items-center justify-between px-4 lg:h-20">
            <a href="/" className="text-2xl font-bold">
              Fair Share
            </a>

            <div className="flex items-center space-x-4">
              {/* my groups tab */}
              {isAuth && (
                <Button onClick={() => navigate("groups")} variant="ghost">
                  <Users className="mr-2 h-4 w-4" />
                  My Groups
                </Button>
              )}

              {/* new group button */}
              {isAuth && (
                <Dialog open={newGroupOpen} onOpenChange={setNewGroupOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost">
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
                        {/* group name */}
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

                        {/* dynamic new member */}
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

                          {newMembers?.map((member, index) => (
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
                                  // value={member.username}
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

              {/* user button */}
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                  <Button variant="ghost">
                    <User className="h-5 w-5" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                {isAuth ? (
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    sideOffset={8}
                    className="rounded-md border bg-white shadow-md"
                  >
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
                  </DropdownMenuContent>
                ) : (
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    sideOffset={8}
                    className="rounded-md border bg-white shadow-md"
                  >
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
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            </div>
          </div>
        </header>
      </div>
      <Outlet />
    </>
  );
}
