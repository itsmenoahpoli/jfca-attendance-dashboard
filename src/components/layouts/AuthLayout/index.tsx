import React from "react";
import { Outlet } from "react-router-dom";
import { Flex } from "@radix-ui/themes";
import { AppSessionManager, AppLoading } from "@/components";

export const AuthLayout: React.FC = () => {
  return (
    <React.Suspense fallback={<AppLoading />}>
      <AppSessionManager />
      <Flex
        justify="center"
        className="h-screen w-full bg-white overflow-hidden relative pt-[5%]"
      >
        <div className="w-[380px]" style={{ zoom: 0.95 }}>
          <div className="!p-8">
            <Outlet />
          </div>
        </div>

        <small className="text-xs text-gray-200 absolute bottom-4 right-4">
          App Version 1.0.1 (beta)
        </small>
      </Flex>
    </React.Suspense>
  );
};
