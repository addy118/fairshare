import { useAuth } from "@/authProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";
import React from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { userId } = useParams();
  const { user } = useAuth();
  // console.log(userId);

  // const user = {
  //   name: "Jane Doe",
  //   username: "janedoe",
  //   email: "jane.doe@example.com",
  //   avatar: "https://via.placeholder.com/128",
  // };

  return (
    <div className="mx-auto max-w-md py-8">
      <Card>
        <div className="flex justify-center bg-gray-100 p-6">
          <Avatar className="border-background h-24 w-24 border-4">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="p-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold">{user.name}</h2>
          </div>
          <dl className="space-y-4">
            <div className="flex flex-col">
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="text-base">@{user.username}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-base">{user.email}</dd>
            </div>
          </dl>
          <div className="mt-6">
            <Button onClick={() => alert("Navigate to Edit Profile")}>
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
