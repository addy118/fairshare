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

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [balances, setBalances] = useState({ owed: [], owes: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupOpen, setNewGroupOpen] = useState(false);

  useEffect(() => {
    const dummyUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg?height=128&width=128",
    };

    const dummyBalances = {
      owed: [
        {
          userId: "1",
          name: "Alice Smith",
          avatar: "/placeholder.svg?height=40&width=40",
          amount: 25.5,
        },
        {
          userId: "2",
          name: "Bob Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
          amount: 15.75,
        },
      ],
      owes: [
        {
          userId: "3",
          name: "Carol Williams",
          avatar: "/placeholder.svg?height=40&width=40",
          amount: 10.25,
        },
        {
          userId: "4",
          name: "Dave Brown",
          avatar: "/placeholder.svg?height=40&width=40",
          amount: 5.0,
        },
      ],
    };

    setUser(dummyUser);
    setBalances(dummyBalances);
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
    <div className="container mx-auto px-4 py-8">
      {user && (
        <>
          <div className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center">
            <div className="mb-4 flex items-center gap-4 md:mb-0">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar || ""} alt={user.name} />
                <AvatarFallback>
                  {user.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => navigate("/groups")}>
                <Users className="mr-2 h-4 w-4" />
                My Groups
              </Button>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">
                  Money You're Owed
                </CardTitle>
                <CardDescription>People who owe you money</CardDescription>
              </CardHeader>
              <CardContent>
                {balances.owed.length === 0 ? (
                  <p className="text-muted-foreground">
                    No one owes you money right now.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {balances.owed.map((balance) => (
                      <li
                        key={balance.userId}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={balance.avatar || ""}
                              alt={balance.name}
                            />
                            <AvatarFallback>
                              {balance.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{balance.name}</span>
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
                  <span>Total</span>
                  <span className="font-bold text-green-600">
                    +$
                    {balances.owed
                      .reduce((sum, item) => sum + item.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Money You Owe</CardTitle>
                <CardDescription>People you need to pay back</CardDescription>
              </CardHeader>
              <CardContent>
                {balances.owes.length === 0 ? (
                  <p className="text-muted-foreground">
                    You don't owe anyone money right now.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {balances.owes.map((balance) => (
                      <li
                        key={balance.userId}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={balance.avatar || ""}
                              alt={balance.name}
                            />
                            <AvatarFallback>
                              {balance.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{balance.name}</span>
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
                  <span>Total</span>
                  <span className="font-bold text-red-600">
                    -$
                    {balances.owes
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
