import React from "react";
import { useLayout } from "@/hooks";
import { SidebarLinks } from "./SidebarLinks";
import { AppLogo } from "@/components";
import { AppLogoTypes } from "@@types/assets.d";
import { type SidebarGroup } from "@@types/layout.d";

export const DashboardSidebar: React.FC<{ items: SidebarGroup[] }> = (
  props
) => {
  const { sidebarCollapsed } = useLayout();
  const sidebarWidthClass = sidebarCollapsed ? "w-[70px]" : "w-[260px]";
  const logoAttrs = sidebarCollapsed
    ? {
        type: AppLogoTypes.BRAND,
        height: 200,
        width: 200,
      }
    : {
        type: AppLogoTypes.BRAND,
        height: 200,
        width: 200,
      };

  return (
    <div
      className={`${sidebarWidthClass} h-screen transition-all duration-300 bg-[#0f1d40] fixed top-0 left-0 overflow-y-auto pb-5 mb-3`}
    >
      <div className="h-full w-full relative">
        <div
          className={`${sidebarWidthClass} mx-auto py-1 flex justify-center items-center`}
        >
          <AppLogo
            type={logoAttrs.type}
            height={logoAttrs.height}
            width={logoAttrs.width}
          />
        </div>

        <div className="pt-10 px-3">
          <SidebarLinks items={props.items} hideLabels={sidebarCollapsed} />
        </div>
      </div>
    </div>
  );
};
