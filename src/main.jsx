import React, { Suspense } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "@/routes";
import { Toaster } from "./components/ui/sonner";
import { ClerkProvider } from "@clerk/clerk-react";
import AxiosInterceptor from "./AxiosInterceptor";
import Loading from "./components/Loading";
import { Provider } from "react-redux";
import { store } from "./store";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkAppearance = {
  variables: {
    colorPrimary: "#4cdede", // accent color (buttons, links, etc.)

    colorTextSecondary: "#b4b4b4",
    colorInputBackground: "#2c313c",

    colorBackground: "#111828", // background for cards/forms
    colorText: "#ffffff", // text color
    colorTextOnPrimaryBackground: "#111828", // text on buttons
    colorNeutral: "#4cdede", // affects borders and outlines
  },
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        appearance={clerkAppearance}
        afterSignOutUrl="/"
      >
        <Suspense
          fallback={<Loading className="min-h-screen" item="Fairshare" />}
        >
          <Toaster theme="light" position="bottom-right" />
          <AxiosInterceptor />
          <RouterProvider router={router} />
        </Suspense>
      </ClerkProvider>
    </Provider>
  </StrictMode>
);
