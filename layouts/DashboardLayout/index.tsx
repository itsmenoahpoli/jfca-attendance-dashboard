import React from "react";

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  return <div>{props.children}</div>;
};
