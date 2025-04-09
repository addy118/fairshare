import React, { useState, useEffect } from "react";
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
import { PlusCircle, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";

export default function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupOpen, setNewGroupOpen] = useState(false);

  useEffect(() => {
    const dummyGroups = [
      {
        id: "1",
        name: "Roommates",
        memberCount: 4,
        userBalance: 35.5,
        members: [
          { name: "John Doe", avatar: "/placeholder.svg" },
          { name: "Alice Smith", avatar: "/placeholder.svg" },
          { name: "Bob Johnson", avatar: "/placeholder.svg" },
          { name: "Carol Williams", avatar: "/placeholder.svg" },
        ],
      },
      {
        id: "2",
        name: "Trip to Paris",
        memberCount: 3,
        userBalance: -15.25,
        members: [
          { name: "John Doe", avatar: "/placeholder.svg" },
          { name: "Dave Brown", avatar: "/placeholder.svg" },
          { name: "Eve Taylor", avatar: "/placeholder.svg" },
        ],
      },
    ];

    setGroups(dummyGroups);
    setIsLoading(false);
  }, []);

  if (isLoading) return <Loading item="groups" />;

  return (
    <div className="mx-auto max-w-4xl px-4">
      <h1 className="mb-8 text-2xl font-bold">My Groups</h1>

      {groups.length === 0 ? (
        <div className="py-12 text-center">
          <Users className="text-muted-foreground mx-auto h-12 w-12" />
          <h2 className="mt-4 text-xl font-semibold">No Groups Yet</h2>
          <p className="text-muted-foreground mt-2">
            Create a group to start splitting expenses with friends.
          </p>
          <Button className="mt-4" onClick={() => setNewGroupOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Your First Group
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card
              key={group.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate(group.id)}
            >
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
                <CardDescription>{group.memberCount} members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex -space-x-2 overflow-hidden">
                  {group.members?.slice(0, 5).map((member, index) => (
                    <Avatar key={index} className="border-background border-2">
                      <AvatarImage
                        src={member.avatar || ""}
                        alt={member.name}
                      />
                      <AvatarFallback>
                        {member.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {group.memberCount > 5 && (
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium">
                      +{group.memberCount - 5}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full justify-between text-sm">
                  <span>Your balance:</span>
                  {group.userBalance > 0 ? (
                    <span className="font-medium text-green-600">
                      +${group.userBalance.toFixed(2)}
                    </span>
                  ) : group.userBalance < 0 ? (
                    <span className="font-medium text-red-600">
                      -${Math.abs(group.userBalance).toFixed(2)}
                    </span>
                  ) : (
                    <span className="font-medium">$0.00</span>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
