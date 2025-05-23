import React, { PropsWithChildren } from "react";
import { useLayout } from "@/hooks";
import { ContentNavbar } from "./ContentNavbar";

type Props = PropsWithChildren;

export const DashboardContent: React.FC<Props> = (props) => {
  const { sidebarCollapsed } = useLayout();

  return (
    <div
      className={`${
        sidebarCollapsed ? "ml-[70px]" : "ml-[260px]"
      } transition-all duration-200 h-full w-full !bg-slate-100`}
    >
      <ContentNavbar />
      <div className="p-2" style={{ zoom: 0.85 }}>
        {props.children}
      </div>
    </div>
  );
};
