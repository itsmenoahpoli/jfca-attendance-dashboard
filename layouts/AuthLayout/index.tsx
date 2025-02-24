import React from "react";

export const AuthLayout: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  return <div className="h-screen w-full">{props.children}</div>;
};
