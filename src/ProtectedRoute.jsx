import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const ProtectedRoute = () => {
  // const { isAuth, loading } = useAuth();
  const { isSignedIn } = useAuth();
  const location = useLocation();

  // if (loading) return <Loading item="user" />;

  return isSignedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
