import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./authProvider";
import Loading from "./components/Loading";

const ProtectedRoute = () => {
  const { isAuth, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading item="user" />;

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
