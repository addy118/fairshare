import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
const App = lazy(() => import("./App"));
const Layout = lazy(() => import("./components/Layout"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const GroupsPage = lazy(() => import("./pages/Groups"));
const GroupPage = lazy(() => import("./pages/Group"));
const ExpenseForm = lazy(() => import("./pages/ExpenseForm"));
const SignInPage = lazy(() => import("./pages/SignInPage"));
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const Profile = lazy(() => import("./pages/Profile"));

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    errorElement: ErrorPage,
    children: [
      { index: true, Component: App },
      { path: "login", Component: SignInPage },
      {
        Component: ProtectedRoute,
        children: [
          { path: "profile", Component: Profile },
          { path: "groups", Component: GroupsPage },
          { path: "groups/:id", Component: GroupPage },
          { path: "groups/:id/expense/new", Component: ExpenseForm },
        ],
      },
    ],
  },
]);

export default router;
