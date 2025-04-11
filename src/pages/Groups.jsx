import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/authProvider";
import format from "@/utils/formatGroup";
import formatDate from "@/utils/formatDate";
import api from "@/axiosInstance";

export default function GroupsPage() {
  const navigate = useNavigate();
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupOpen, setNewGroupOpen] = useState(false);

  const { user } = useAuth();
  const groups = format.groups(user.groups);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      await api.post("/grp/new", { name: newGroupName });
      console.log(`Creating group: ${newGroupName}`);
      setNewGroupOpen(false);
      setNewGroupName("");
      navigate("/groups");
    } catch (err) {
      console.error("Failed to create a group: ", err);
    }
  };

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
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card
              key={group.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => {
                navigate(`${group.id}`);
                console.log(group.id);
              }}
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
                <div className="flex w-full items-center justify-between text-sm">
                  <span>Created on: </span>
                  <span className="text-xs">{formatDate(group.createdAt)}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
