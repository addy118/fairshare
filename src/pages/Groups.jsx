import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/authProvider";
import format from "@/utils/formatGroup";
import formatDate from "@/utils/formatDate";
import api from "@/axiosInstance";
import UserPic from "@/components/UserPic";

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
      <h1 className="gradient-text mb-8 text-2xl font-bold">My Groups</h1>

      {groups.length === 0 ? (
        <Card className="glass-dark border border-gray-700/50 py-12 text-center shadow-lg">
          <CardContent>
            <Users className="mx-auto h-12 w-12 text-teal-400" />
            <h2 className="mt-4 text-xl font-semibold">No Groups Yet</h2>
            <p className="mt-2 text-gray-300">
              Create a group to start splitting expenses with friends.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card
              key={group.id}
              className="glass-dark hover-lift cursor-pointer border border-gray-700/50 shadow-lg transition-all duration-300"
              onClick={() => {
                navigate(`${group.id}`);
                console.log(group.id);
              }}
            >
              <CardHeader>
                <CardTitle className="gradient-text">{group.name}</CardTitle>
                <CardDescription className="text-gray-300">
                  {group.memberCount} members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex -space-x-2 overflow-hidden">
                  {group.members?.slice(0, 5).map((member, index) => (
                    <Avatar key={index} className="border-1 border-teal-800">
                      <UserPic name={member.name} />
                    </Avatar>
                  ))}
                  {group.memberCount > 5 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-xs font-medium">
                      +{group.memberCount - 5}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full items-center justify-between text-sm">
                  <span className="text-gray-400">Created on: </span>
                  <span className="text-xs text-gray-300">
                    {formatDate(group.createdAt)}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
