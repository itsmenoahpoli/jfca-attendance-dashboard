import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { LazyLoadComponent } from "@/components";
import { AuthLayout } from "@/layouts";
import { ROUTES } from "@/constants";

/**
 * Error Page
 */
const ErrorPage = LazyLoadComponent(React.lazy(() => import("@/views/ErrorPage")));

/**
 * Auth
 */
const LoginPage = LazyLoadComponent(React.lazy(() => import("@/views/auth/LoginPage")));

const router = createBrowserRouter([
  {
    path: "*",
    element: ErrorPage,
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
]);

export default router;
