import React, { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/authProvider";
import UserPic from "@/components/UserPic";
import api from "@/axiosInstance";
import UserBalance from "@/components/UserBalance";

export default function Home() {
  const { user, isAuth } = useAuth();

  const [balances, setBalances] = useState({ owed: [], owes: [] });
  const [isLoading, setIsLoading] = useState(true);

  // fetch user balance
  useEffect(() => {
    if (!isAuth) return;

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

  if (isLoading) {
    return (
      <div className="screen flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>

        <div>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4">
      {user && (
        <>
          <div className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center">
            {/* user details */}
            <div className="mb-4 flex items-center gap-4 md:mb-0">
              <Avatar className="h-16 w-16">
                <UserPic name={user.name} />
              </Avatar>

              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>

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
