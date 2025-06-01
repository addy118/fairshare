import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth, useUser } from "@clerk/clerk-react";
import api from "@/axiosInstance";
import UserBalance from "@/components/UserBalance";
import Loading from "@/components/Loading";
import { Card, CardContent } from "@/components/ui/card";
import formatUser from "@/utils/formatUser";
import { QRCodeSVG } from "qrcode.react";
import UpiForm from "@/components/UpiForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { isSignedIn, isLoaded, user: clerkUser } = useUser();
  const user = formatUser(clerkUser);
  const navigate = useNavigate();

  const [balances, setBalances] = useState({ owed: [], owes: [] });
  const [upi, setUpi] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // fetch user balance
  useEffect(() => {
    if (!isSignedIn) return null;

    const fetchBalances = async () => {
      try {
        const response = await api.get(`user/${user.id}/balance`);
        setBalances(response.data);

        const upiRes = await api.get(`user/${user.id}/upi`);
        setUpi(upiRes.data?.upi);
      } catch (err) {
        console.error("Failed to fetch balances:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [isSignedIn, user?.id]);

  if (!isLoaded) return <Loading item="user" />;
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
                    <AvatarImage src={user.pfp} />
                    <AvatarFallback className="bg-gray-400">
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h1 className="gradient-text text-2xl font-bold">
                      {user.name}
                    </h1>
                    <p className="text-white">{upi || ""}</p>
                    <p className="text-gray-300">{user.username}</p>
                  </div>
                </div>

                <div>
                  {upi ? (
                    <QRCodeSVG
                      value={`upi://pay?pa=${upi}&pn=${encodeURIComponent(user.name)}&cu=INR`}
                      size={100}
                      // bgColor="#111828"
                      // fgColor="#14b8a6"
                      bgColor="#14b8a6"
                      fgColor="#111828"
                    />
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate("/upi");
                      }}
                    >
                      Add UPI ID
                    </Button>
                  )}
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
