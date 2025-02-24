import React from "react";
import { Outlet } from "react-router-dom";
import { Flex, Card } from "@radix-ui/themes";
import { AppSessionManager, AppLoading } from "@/components";
// import { ASSETS } from "@/constants";

export const AuthLayout: React.FC = () => {
  return (
    <React.Suspense fallback={<AppLoading />}>
      <AppSessionManager />
      <Flex
        justify="center"
        className="h-screen w-full bg-green-800 overflow-hidden relative pt-[5%]"
      >
        <div className="w-[380px]" style={{ zoom: 0.9 }}>
          <Flex justify="center" className="mb-10">
            {/* <img src={ASSETS.PMR_LOGO} alt="brand-logo.png" className="w-[70px]" /> */}
          </Flex>

          <Card className="!bg-white !shadow-sm !p-8">
            <Outlet />
          </Card>
        </div>

        <small className="text-xs text-gray-200 absolute bottom-4 right-4">
          App Version 1.0.1 (beta)
        </small>
      </Flex>
    </React.Suspense>
  );
};
