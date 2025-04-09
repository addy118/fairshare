import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AuthProvider from "@/authProvider";
import ProtectedRoute from "@/ProtectedRoute";
import App from "@/App";
import LoginPage from "@/pages/Login";
import Home from "@/pages/Home";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import SignupPage from "./pages/SignUp";
import ErrorPage from "./pages/ErrorPage";
import NewExpense from "./pages/NewExpense";
import GroupsPage from "./pages/Groups";
import GroupPage from "./pages/Group";
import ProfilePage from "./pages/UserHome";

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
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          // {
          //   path: "home",
          //   element: <Home />,
          // },
          {
            path: "home",
            element: <ProfilePage />,
          },
          {
            path: "user/:userId/profile",
            element: <Profile />,
          },
          {
            path: "expense/new",
            element: <NewExpense />,
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
