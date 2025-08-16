import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/card";
import { Button } from "./ui/button";
import Loading from "./Loading";
import { toast } from "sonner";
import api from "@/axiosInstance";
import { useUser } from "@clerk/clerk-react";
import formatUser from "@/utils/formatUser";
import { useNavigate } from "react-router-dom";

export default function UpiForm() {
  const { user: clerkUser } = useUser();
  const user = formatUser(clerkUser);
  const navigate = useNavigate();

  const [upi, setUpi] = useState("");
  const [isLoading, SetIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const upiBroken = upi.split("@");
      if (!upiBroken[0] || !upiBroken[1]) {
        toast.error("Please enter a valid UPI ID");
        return;
      }

      SetIsLoading(true);
      await api.put(`user/${user.id}/upi`, { upi });
      SetIsLoading(false);
      toast.success("UPI added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding UPI: ", error);
      toast.error(error.message || error || "Failed to add UPI");
    } finally {
      SetIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mb-20 max-w-xl px-4">
      <Card className="glass-dark border border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardDescription className="text-gray-300">
            Enter your UPI ID
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <Input
              id="upi"
              placeholder="name@bank"
              type="text"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              required
            />
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-gradient-to-r from-[#00a2ff] to-[#00bcff] text-white shadow-lg transition-all duration-300 hover:from-[#00bcff] hover:to-[#00a2ff] hover:shadow-[#00a2ff]/25"
            >
              {isLoading ? (
                <Loading action="Submitting" item="UPI ID" />
              ) : (
                "Submit UPI ID"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
