import React from "react";
import LandingPage from "./components/LandingPage";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Home from "./pages/Home";

export default function App() {
  return (
    <header>
      <SignedOut>
        <LandingPage />
      </SignedOut>

      <SignedIn>
        <Home />
      </SignedIn>
    </header>
  );
}
