import React from "react";
import { useState } from "react";
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
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Log In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data">Username or Email</Label>

              <Input
                id="data"
                placeholder="johndoe or john@example.com"
                required
                value={formData.data}
                onChange={handleChange}
                disabled={loading}
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
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forgot-password"
                  className="text-primary text-sm hover:underline"
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
              className="w-full cursor-pointer border border-zinc-200 bg-zinc-200 text-black transition-colors duration-300 hover:border-zinc-300 hover:bg-zinc-300 active:border-zinc-200 active:bg-zinc-200 active:text-black"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <span className="mr-2">Logging in</span>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-800 border-t-transparent"></span>
                </div>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link to={`/signup`} className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
