import React from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Outlet, useLocation } from "react-router-dom";
import { Flex } from "@radix-ui/themes";
import { AppLoading, AppSessionManager } from "@/components";
import { SIDEBAR_ITEMS } from "./DashboardSidebar/data/sidebar-items";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardContent } from "./DashboardContent";

export const DashboardLayout: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    NProgress.start();

    setTimeout(() => {
      NProgress.done();
    }, 1000);

    return () => {
      NProgress.done();
    };
  }, [location]);

  return (
    <React.Suspense fallback={<AppLoading />}>
      <AppSessionManager />

      <Flex direction="row" className="h-screen w-full overflow-x-hidden">
        <DashboardSidebar items={SIDEBAR_ITEMS} />
        <DashboardContent children={<Outlet />} />
      </Flex>
    </React.Suspense>
  );
};
