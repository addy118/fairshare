import React, { useEffect } from "react";
import { useAuth } from "./authProvider";
import { useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";

export default function App() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate("/home");
    }
  }, [isAuth, navigate]);

  return (
    <div className="flex items-center justify-center">
      {!isAuth && <LandingPage />}
    </div>
  );
}
