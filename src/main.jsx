import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "@/routes";
import { Toaster } from "./components/ui/sonner";
import { ClerkProvider } from "@clerk/clerk-react";
import AxiosInterceptor from "./AxiosInterceptor";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <Toaster theme="light" position="bottom-right" />

      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          variables: {
            colorPrimary: "#4cdede", // accent color (buttons, links, etc.)
            colorTextSecondary: "#b4b4b4",
            colorInputBackground: "#E9FCFF",
            colorBackground: "#111828", // background for cards/forms
            colorText: "#ffffff", // text color
            colorTextOnPrimaryBackground: "#111828", // text on buttons
            colorNeutral: "#4cdede", // affects borders and outlines
          },
        }}
        afterSignOutUrl="/"
      >
        <AxiosInterceptor />
        <RouterProvider router={router} />
      </ClerkProvider>
    </>
  </StrictMode>
);
