import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout } from "@/components";
import { AuthGuard } from "@/components/guards/AuthGuard";
import {
  SigninPage,
  OverviewPage,
  StudentsPage,
  ClassesPage,
  AttendanceReportsPage,
  AttendanceModulePage,
} from "@/views";
import {
  WEB_ROUTES,
  AUTH_ROUTE_PREFIX,
  DASHBOARD_ROUTE_PREFIX,
} from "@/constants";

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
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: WEB_ROUTES.DASHBOARD_OVERVIEW,
        element: <OverviewPage />,
      },
      {
        path: WEB_ROUTES.DASHBOARD_STUDENTS,
        element: <StudentsPage />,
      },
      {
        path: WEB_ROUTES.DASHBOARD_CLASSES,
        element: <ClassesPage />,
      },
      {
        path: WEB_ROUTES.DASHBOARD_ATTENDANCE_REPORTS,
        element: <AttendanceReportsPage />,
      },
    ],
  },
  {
    path: WEB_ROUTES.MODULE_ATTENDANCE,
    element: <AttendanceModulePage />,
  },
]);

export default router;
