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
import {
  Edit,
  Edit2,
  Edit2Icon,
  Edit3,
  Edit3Icon,
  LucideEdit,
  Pencil,
  PlusCircleIcon,
} from "lucide-react";

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

  // const handleAddUpi = async () => {
  //   return;
  // };

  return (
    <div className="mx-auto max-w-4xl rounded-sm px-4 sm:px-6 lg:px-8">
      {user && (
        <>
          <Card className="glass-dark mb-6 rounded-sm shadow-lg sm:mb-8">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center flex-wrap justify-between gap-4">
                {/* user details */}
                <div className="flex items-center gap-4 sm:items-center">
                  <Avatar className="h-16 w-16 border border-[#00a2ff]/30 sm:h-20 sm:w-20">
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

                  {/* user info */}
                  <div className="text-left">
                    <h1 className="gradient-text text-xl font-bold sm:text-2xl">
                      {user.name}
                    </h1>

                    <div className="flex items-center gap-2 text-sm text-white sm:text-base">
                      {(upi && <div className="text-gray-400">{upi}</div>) || (
                        <div
                          className="flex cursor-pointer items-center justify-between gap-1 text-sm text-gray-300 sm:text-base"
                          onClick={() => {
                            navigate("/upi");
                          }}
                        >
                          <PlusCircleIcon size="16" /> UPI ID
                        </div>
                      )}{" "}
                      {upi && (
                        <Edit
                          onClick={() => {
                            navigate("/upi");
                          }}
                          size="14"
                          color="#adadad"
                          className="cursor-pointer"
                        />
                      )}
                    </div>

                    <p className="text-sm text-gray-300 sm:text-base">
                      <span className=" text-gray-400">@</span>{user.username}
                    </p>
                  </div>
                </div>

                {/* QR Code */}
                {upi && (
                  <div className="hidden sm:block sm:space-y-2">
                    <QRCodeSVG
                      value={`upi://pay?pa=${upi}&pn=${encodeURIComponent(user.name)}&cu=INR`}
                      size={90}
                      marginSize="1"
                      bgColor="#ADCDFF"
                      fgColor="#111828"
                    />
                  </div>
                )}
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
