import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Users, PlusCircle } from "lucide-react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Layout() {
  const navigate = useNavigate();
  const { isAuth, logout } = useAuth();

  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupOpen, setNewGroupOpen] = useState(false);

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    console.log(`Creating group: ${newGroupName}`);
    setNewGroupOpen(false);
    setNewGroupName("");
    navigate("/groups");
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
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Group Name</Label>
                          <Input
                            id="name"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="e.g., Roommates, Trip to Paris"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Create Group</Button>
                      </DialogFooter>
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
                    <Link to={"/home"}>
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
