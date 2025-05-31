import React, { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@clerk/clerk-react";
import UserPic from "@/components/UserPic";
import api from "@/axiosInstance";
import UserBalance from "@/components/UserBalance";
import Loading from "@/components/Loading";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  // const { user, isAuth } = useAuth();
  const { isSignedIn } = useAuth();
  const user = {
    id: 1,
  };

  const [balances, setBalances] = useState({ owed: [], owes: [] });
  const [isLoading, setIsLoading] = useState(true);

  // fetch user balance
  useEffect(() => {
    if (!isSignedIn) return;

    const fetchBalances = async () => {
      try {
        const response = await api.get(`user/${user.id}/balance`);
        setBalances(response.data);
      } catch (err) {
        console.error("Failed to fetch balances:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [user]);

  if (isLoading) return <Loading item="profile" />;

  return (
    <div className="mx-auto max-w-4xl px-4">
      {user && (
        <>
          <Card className="glass-dark mb-8 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
                {/* user details */}
                <div className="mb-4 flex items-center gap-4 md:mb-0">
                  <Avatar className="h-16 w-16 border border-teal-500/30">
                    <UserPic name={user.name} />
                  </Avatar>

                  <div>
                    <h1 className="gradient-text text-2xl font-bold">
                      {user.name}
                    </h1>
                    <p className="text-gray-300">{user.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* money you are owed */}
            <UserBalance balances={balances} isCreditor={true} />

            {/* money you owe */}
            <UserBalance balances={balances} isCreditor={false} />
          </div>
        </>
      )}
    </div>
  );
}
