import React from "react";
import { Outlet } from "react-router-dom";
import { Theme, Flex, Box } from "@radix-ui/themes";
import { ASSETS } from "@/constants";

const currentYear = new Date().getFullYear();

export const AuthLayout: React.FC = () => {
  return (
    <Theme appearance="light" scaling="90%" id="auth-layout">
      <Flex direction="column" align="center" gap="4" className="h-screen w-full pt-[7%] relative" style={{ zoom: 0.85 }}>
        <p className="top-5 left-5 absolute text-xs font-medium">DASHBOARD PORTAL (version 1.0.1 BETA)</p>

        <Box className="w-[400px] rounded-lg bg-white border shadow p-8">
          <img src={ASSETS.BRAND_LOGO} alt="brand-logo.png" className="h-[180px] w-auto mx-auto mb-5" />

          <Outlet />
        </Box>

        <p className="text-gray-800">All Rights Reserved &copy; {currentYear}</p>
      </Flex>
    </Theme>
  );
};
