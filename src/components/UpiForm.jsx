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
      SetIsLoading(true);
      await api.put(`user/${user.id}/upi`, { upi });
      SetIsLoading(false);
      toast.success("UPI added successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error adding UPI: ", err);
      toast.error(err.message || err || "Failed to add UPI");
    } finally {
      SetIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mb-20 max-w-xl px-4">
      <Card className="glass-dark border border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardDescription className="text-gray-300">
            Add your UPI ID
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <Input
              id="upi"
              placeholder="Enter your UPI ID"
              type="text"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
            />
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-gradient-to-r from-teal-500 to-teal-400 text-white shadow-lg transition-all duration-300 hover:from-teal-400 hover:to-teal-500 hover:shadow-teal-500/25"
            >
              {isLoading ? (
                <Loading action="Creating" item="expense" />
              ) : (
                "Add UPI"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
