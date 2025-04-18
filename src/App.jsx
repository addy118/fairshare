import React, { useEffect } from "react";
import { useAuth } from "./authProvider";
import { useNavigate } from "react-router-dom";

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
      {!isAuth && (
        <h2 className="m-8 text-4xl font-bold">
          Register on our app today itself!
        </h2>
      )}
    </div>
  );
}
