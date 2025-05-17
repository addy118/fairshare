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
    signup(formData);
  };

  return (
    <div className="flex items-center justify-center px-4">
      <Card className="glass-dark w-full max-w-md border border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl">Sign Up</CardTitle>
          <CardDescription className="text-gray-300">
            Create a new account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* name */}
            <div className="space-y-2">
              <Label className="text-white" htmlFor="name">
                Name
              </Label>

              <Input
                id="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className="border-gray-700 bg-gray-800/50"
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
              <Label className="text-white" htmlFor="username">
                Username
              </Label>

              <Input
                id="username"
                placeholder="johndoe"
                required
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                className="border-gray-700 bg-gray-800/50"
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
              <Label className="text-white" htmlFor="phone">
                Phone
              </Label>

              <Input
                id="phone"
                placeholder="+919999999999"
                required
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className="border-gray-700 bg-gray-800/50"
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
              <Label className="text-white" htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="border-gray-700 bg-gray-800/50"
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
              <Label className="text-white" htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="border-gray-700 bg-gray-800/50"
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
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg transition-all duration-300 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-500/30"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <span className="mr-2">Creating account</span>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to={`/login`} className="text-teal-400 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
