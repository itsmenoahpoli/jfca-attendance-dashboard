import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks";
import { WEB_ROUTES } from "@/constants";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { authToken } = useAuth();
  const location = useLocation();

  if (!authToken) {
    return (
      <Navigate to={WEB_ROUTES.SIGN_IN} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};
