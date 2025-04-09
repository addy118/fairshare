import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Users } from "lucide-react";
import { useAuth } from "@/authProvider";
import { userBal } from "@/mockData/userMock";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [balances, setBalances] = useState({ owed: [], owes: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupOpen, setNewGroupOpen] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    console.log(`Creating group: ${newGroupName}`);
    setNewGroupOpen(false);
    setNewGroupName("");
    navigate("/groups");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4">
      {user && (
        <>
          <div className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center">
            {/* user profile */}
            <div className="mb-4 flex items-center gap-4 md:mb-0">
              <Avatar className="h-16 w-16">
                <AvatarFallback>
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex gap-4">
              {/* my groups */}
              <Button onClick={() => navigate("/groups")}>
                <Users className="mr-2 h-4 w-4" />
                My Groups
              </Button>

              {/* create group dialog box */}
              <Dialog open={newGroupOpen} onOpenChange={setNewGroupOpen}>
                <DialogTrigger asChild>
                  <Button>
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
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* money you are owed */}
            <Card>
              <CardHeader>
                <CardTitle>Money You're Owed</CardTitle>
                <CardDescription>People who owe you money</CardDescription>
              </CardHeader>
              <CardContent>
                {userBal.creditor.length === 0 ? (
                  <p className="text-muted-foreground">
                    No one owes you money right now.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {userBal.creditor.map((balance) => (
                      <li
                        key={balance.debtor.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage alt={balance.debtor.name} />
                            <AvatarFallback>
                              {balance.debtor.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{balance.debtor.name}</span>
                        </div>
                        <span className="font-medium text-green-600">
                          +${balance.amount.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex w-full justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-green-600">
                    +$
                    {userBal.creditor
                      .reduce((sum, item) => sum + item.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </CardFooter>
            </Card>

            {/* money you owe */}
            <Card>
              <CardHeader>
                <CardTitle>Money You Owe</CardTitle>
                <CardDescription>People you need to pay back</CardDescription>
              </CardHeader>
              <CardContent>
                {userBal.debtor.length === 0 ? (
                  <p className="text-muted-foreground">
                    You don't owe anyone money right now.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {userBal.debtor.map((balance) => (
                      <li
                        key={balance.creditor.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage alt={balance.creditor.name} />
                            <AvatarFallback>
                              {balance.creditor.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{balance.creditor.name}</span>
                        </div>
                        <span className="font-medium text-red-600">
                          -${balance.amount.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex w-full justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-red-600">
                    -$
                    {userBal.debtor
                      .reduce((sum, item) => sum + item.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
