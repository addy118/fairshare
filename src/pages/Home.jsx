import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@clerk/clerk-react";
import api from "@/axiosInstance";
import UserBalance from "@/components/UserBalance";
import Loading from "@/components/Loading";
import { Card, CardContent } from "@/components/ui/card";
import formatUser from "@/utils/formatUser";
import { QRCodeSVG } from "qrcode.react";
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
        console.log(response.data);
        setBalances(response.data);

        const upiRes = await api.get(`user/${user.id}/upi`);
        setUpi(upiRes.data?.upi);
      } catch (error) {
        console.error("Failed to fetch balances:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [isSignedIn, user?.id]);

  if (!isLoaded) return <Loading item="user" />;
  if (isLoading) return <Loading item="profile" />;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      {user && (
        <>
          <Card className="glass-dark mb-6 shadow-lg sm:mb-8">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* user details */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                  <Avatar className="h-16 w-16 border border-teal-500/30 sm:h-20 sm:w-20">
                    <AvatarImage src={user.pfp || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gray-400 text-lg sm:text-xl">
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center sm:text-left">
                    <h1 className="gradient-text text-xl font-bold sm:text-2xl">
                      {user.name}
                    </h1>
                    <p className="text-sm text-white sm:text-base">
                      {upi || ""}
                    </p>
                    <p className="text-sm text-gray-300 sm:text-base">
                      {user.username}
                    </p>
                  </div>
                </div>

                {/* QR Code / UPI Button */}
                <div className="flex flex-col items-center gap-2">
                  {upi ? (
                    <>
                      <QRCodeSVG
                        value={`upi://pay?pa=${upi}&pn=${encodeURIComponent(user.name)}&cu=INR`}
                        size={80}
                        bgColor="#14b8a6"
                        fgColor="#111828"
                        className="sm:hidden"
                      />
                      <QRCodeSVG
                        value={`upi://pay?pa=${upi}&pn=${encodeURIComponent(user.name)}&cu=INR`}
                        size={100}
                        bgColor="#14b8a6"
                        fgColor="#111828"
                        className="hidden sm:block"
                      />
                      <p className="text-xs text-gray-400 sm:text-sm">
                        Scan to pay
                      </p>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate("/upi");
                      }}
                      className="w-full sm:w-auto"
                    >
                      Add UPI ID
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
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
