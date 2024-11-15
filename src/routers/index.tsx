import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { LazyLoadComponent } from "@/components";
import { AuthLayout, DashboardLayout } from "@/layouts";
import { ROUTES } from "@/constants";

/**
 * Error Page
 */
const ErrorPage = LazyLoadComponent(React.lazy(() => import("@/views/ErrorPage")));

/**
 * Auth
 */
const LoginPage = LazyLoadComponent(React.lazy(() => import("@/views/auth/LoginPage")));

/**
 * Dashboard
 */
const OverviewPage = LazyLoadComponent(React.lazy(() => import("@/views/dashboard/OverviewPage")));

const router = createBrowserRouter([
  {
    path: "*",
    element: ErrorPage,
  },
  {
    path: "/",
    element: <Navigate to={ROUTES.WEB.LOGIN} />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.WEB.LOGIN,
        element: LoginPage,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: ROUTES.WEB.DASHBOARD_HOME,
        element: OverviewPage,
      },
    ],
  },
]);

export default router;
