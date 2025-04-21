import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/authProvider";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const { signupErrors, signup, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Signup Data:", formData);

    // ensure formData matches the structure for /signup body
    signup(formData);
  };

  return (
    <div className="bg-[#0f1728] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>

              <Input
                id="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />

              {signupErrors.name &&
                signupErrors.name.map((err, i) => (
                  <p key={i} className="text-red-400">
                    {err}
                  </p>
                ))}
            </div>

            {/* username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>

              <Input
                id="username"
                placeholder="johndoe"
                required
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />

              {signupErrors.username &&
                signupErrors.username.map((err, i) => (
                  <p key={i} className="text-red-400">
                    {err}
                  </p>
                ))}
            </div>

            {/* phone */}
            <div className="space-y-2">
              <Label htmlFor="name">Phone</Label>

              <Input
                id="phone"
                placeholder="John Doe"
                required
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />

              {signupErrors.phone &&
                signupErrors.phone.map((err, i) => (
                  <p key={i} className="text-red-400">
                    {err}
                  </p>
                ))}
            </div>

            {/* email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />

              {signupErrors.email &&
                signupErrors.email.map((err, i) => (
                  <p key={i} className="text-red-400">
                    {err}
                  </p>
                ))}
            </div>

            {/* password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />

              {signupErrors.password &&
                signupErrors.password.map((err, i) => (
                  <p key={i} className="text-red-400">
                    {err}
                  </p>
                ))}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer border border-zinc-200 bg-zinc-200 text-black transition-colors duration-300 hover:border-zinc-300 hover:bg-zinc-300 active:border-zinc-200 active:bg-zinc-200 active:text-black"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <span className="mr-2">Creating account</span>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-800 border-t-transparent"></span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link to={`/login`} className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
