import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout } from "@/components";
import { SigninPage, OverviewPage, PatientProfilesListPage } from "@/views";
import { WEB_ROUTES, AUTH_ROUTE_PREFIX, DASHBOARD_ROUTE_PREFIX } from "../constants";

const router = createBrowserRouter([
  {
    path: WEB_ROUTES.INDEX,
    element: <Navigate to={WEB_ROUTES.SIGN_IN} />,
  },
  {
    path: AUTH_ROUTE_PREFIX,
    element: <AuthLayout />,
    children: [
      {
        path: WEB_ROUTES.SIGN_IN,
        element: <SigninPage />,
      },
    ],
  },
  {
    path: DASHBOARD_ROUTE_PREFIX,
    element: <DashboardLayout />,
    children: [
      {
        path: WEB_ROUTES.DASHBOARD_OVERVIEW,
        element: <OverviewPage />,
      },
      {
        path: WEB_ROUTES.DASHBOARD_PATIENT_PROFILES_LIST,
        element: <PatientProfilesListPage />,
      },
    ],
  },
]);

export default router;
