import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import formatGroup from "@/utils/formatGroup";
import formatDate from "@/utils/formatDate";
import formatUser from "@/utils/formatUser";
import { useUser } from "@clerk/clerk-react";
import Loading from "@/components/Loading";
import api from "@/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function GroupsPage() {
  const navigate = useNavigate();

  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const user = formatUser(clerkUser);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // fetch user groups
  useEffect(() => {
    if (!isSignedIn) return null;

    const fetchGroups = async () => {
      try {
        const response = await api.post(`/user/${user.id}/groups`);
        const formatRes = formatGroup.groups(response.data);
        setGroups(formatRes);
      } catch (error) {
        console.error(
          "Failed to fetch groups:",
          error?.response?.data || error.message || error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [isSignedIn, user?.id]);

  if (!isLoaded) return <Loading item="user" />;
  if (isLoading) return <Loading item="groups" />;

  return (
    <div className="mx-auto max-w-4xl px-4">
      {/* <h1 className="mb-8 text-2xl font-bold text-white">My Groups</h1> */}

      {groups?.length === 0 ? (
        <Card className="glass-dark border border-gray-700/50 py-12 text-center shadow-lg">
          <CardContent>
            <Users className="mx-auto h-12 w-12 text-teal-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-300">
              No Groups Yet
            </h2>
            <p className="mt-2 text-gray-300">
              Create a group to start splitting expenses with friends.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups?.map((group) => (
            <Card
              key={group.id}
              className="glass-dark hover-lift cursor-pointer border border-gray-700/50 shadow-lg transition-all duration-300"
              onClick={() => navigate(`${group.id}`)}
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
                      <AvatarImage src={member.pfp} />
                      <AvatarFallback className="bg-gray-400">
                        {member.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
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
