import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./authProvider";

const ProtectedRoute = () => {
  const { isAuth, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="screen flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>

        <div>Loading user...</div>
      </div>
    );
  }

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
