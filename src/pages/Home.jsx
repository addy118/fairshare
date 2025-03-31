import React from "react";
import { useAuth } from "@/authProvider";
import { Outlet } from "react-router-dom";

function Home() {
  const { user } = useAuth();

  return (
    <div className="m-8 text-4xl font-bold">
      Welcome {user.name}!
      <Outlet />
    </div>
  );
}

export default Home;
