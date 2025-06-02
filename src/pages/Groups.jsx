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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {groups?.length === 0 ? (
        <Card className="glass-dark border border-gray-700/50 py-8 text-center shadow-lg sm:py-12">
          <CardContent>
            <Users className="mx-auto h-10 w-10 text-teal-400 sm:h-12 sm:w-12" />
            <h2 className="mt-4 text-lg font-semibold text-gray-300 sm:text-xl">
              No Groups Yet
            </h2>
            <p className="mt-2 text-sm text-gray-300 sm:text-base">
              Create a group to start splitting expenses with friends.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {groups?.map((group) => (
            <Card
              key={group.id}
              className="glass-dark hover-lift cursor-pointer border border-gray-700/50 shadow-lg transition-all duration-300"
              onClick={() => navigate(`${group.id}`)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="gradient-text text-lg sm:text-xl">
                  {group.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-300 sm:text-base">
                  {group.memberCount} members
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex -space-x-2 overflow-hidden">
                  {group.members?.slice(0, 4).map((member, index) => (
                    <Avatar
                      key={index}
                      className="h-8 w-8 border-1 border-teal-800 sm:h-10 sm:w-10"
                    >
                      <AvatarImage src={member.pfp || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gray-400 text-xs sm:text-sm">
                        {member.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {group.memberCount > 4 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-xs font-medium sm:h-10 sm:w-10">
                      +{group.memberCount - 4}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-3">
                <div className="flex w-full flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-gray-300">
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
