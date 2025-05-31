import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AuthProvider from "@/authProvider";
import ProtectedRoute from "@/ProtectedRoute";
import App from "@/App";
import Layout from "./components/Layout";
import ErrorPage from "./pages/ErrorPage";
import GroupsPage from "./pages/Groups";
import GroupPage from "./pages/Group";
import Home from "./pages/Home";
import ExpenseForm from "./pages/ExpenseForm";
import Profile from "./pages/Profile";
import SignInPage from "./pages/SignInPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <App /> },
      // { path: "/", element: <LandingPage /> },
      {
        path: "login",
        element: <SignInPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "home",
            element: <Home />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "groups/:groupId/expense/new",
            element: <ExpenseForm />,
          },
          {
            path: "groups",
            element: <GroupsPage />,
          },
          {
            path: "groups/:id",
            element: <GroupPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
