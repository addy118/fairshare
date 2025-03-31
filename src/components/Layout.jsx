import React from "react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/authProvider";

export default function Layout() {
  const user = { id: 1 };
  const { isAuth, signup, login, logout } = useAuth();

  return (
    <>
      <div className="bg-background mb-6">
        <header className="border-b">
          <div className="max-w-8xl mx-auto flex h-16 items-center justify-between px-4 lg:h-20">
            <a href="/" className="text-2xl font-bold">
              Fair Share
            </a>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                  <User className="h-5 w-5" />
                </DropdownMenuTrigger>
                {isAuth ? (
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    sideOffset={8}
                    className="rounded-md border bg-white shadow-md"
                  >
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link to={`/user/${user.id}/profile`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={logout}>
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                ) : (
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    sideOffset={8}
                    className="rounded-md border bg-white shadow-md"
                  >
                    <Link to={`/login`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Login
                      </DropdownMenuItem>
                    </Link>
                    <Link to={`/signup`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Register
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            </div>
          </div>
        </header>
      </div>
      <Outlet />
    </>
  );
}
