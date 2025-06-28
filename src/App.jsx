import React from "react";
import LandingPage from "./components/LandingPage";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Home from "./pages/Home";
import AxiosInterceptor from "./AxiosInterceptor";

export default function App() {
  return (
    <header>
      <SignedOut>
        <LandingPage />
      </SignedOut>

      <SignedIn>
        <AxiosInterceptor />
        <Home />
      </SignedIn>
    </header>
  );
}
