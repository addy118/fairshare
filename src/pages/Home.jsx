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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAuth } from "@/authProvider";
import UserPic from "@/components/UserPic";
import api from "@/axiosInstance";

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
        // console.log(response.data);
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
            {/* user profile */}
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
            <Card>
              <CardHeader>
                <CardTitle>Money You're Owed</CardTitle>
                <CardDescription>People who owe you money</CardDescription>
              </CardHeader>
              <CardContent>
                {balances.creditor.length === 0 ? (
                  <p className="text-muted-foreground">
                    No one owes you money right now.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {balances.creditor.map((balance) => (
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
                    {balances.creditor
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
                {balances.debtor.length === 0 ? (
                  <p className="text-muted-foreground">
                    You don't owe anyone money right now.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {balances.debtor.map((balance) => (
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
                    {balances.debtor
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
