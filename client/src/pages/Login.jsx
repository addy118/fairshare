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
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { isAuth, login, loginErrors, loading } = useAuth();
  const [formData, setFormData] = useState({
    data: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  if (isAuth) navigate("/home");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      login(formData);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <Card className="glass-dark w-full max-w-md border border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl">Log In</CardTitle>
          <CardDescription className="text-gray-300">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white" htmlFor="data">
                Username or Email
              </Label>

              <Input
                id="data"
                placeholder="johndoe or john@example.com"
                required
                value={formData.data}
                onChange={handleChange}
                disabled={loading}
                className="border-gray-700 bg-gray-800/50"
              />

              {loginErrors.data &&
                loginErrors.data.map((err, i) => (
                  <p key={i} className="text-red-400">
                    {err}
                  </p>
                ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white" htmlFor="password">
                  Password
                </Label>
                <a
                  href="/forgot-password"
                  className="text-sm text-teal-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="border-gray-700 bg-gray-800/50"
              />

              {loginErrors.password &&
                loginErrors.password.map((err, i) => (
                  <p key={i} className="text-red-400">
                    {err}
                  </p>
                ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-teal-400 text-white shadow-lg transition-all duration-300 hover:from-teal-400 hover:to-teal-500 hover:shadow-teal-500/25"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <span className="mr-2">Logging in</span>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                </div>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to={`/signup`} className="text-teal-400 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
