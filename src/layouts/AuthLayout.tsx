import React from "react";
import { Theme, Flex, Box, TextField, Button } from "@radix-ui/themes";
import { ASSETS, STATIC_TEXT } from "@/constants";

const currentYear = new Date().getFullYear();

export const AuthLayout: React.FC = () => {
  return (
    <Theme appearance="light" scaling="90%" id="auth-layout">
      <Flex direction="column" align="center" gap="4" className="h-screen w-full pt-[7%] relative" style={{ zoom: 0.85 }}>
        <p className="top-5 left-5 absolute text-xs font-medium">DASHBOARD PORTAL (version 1.0.1 BETA)</p>

        <Box className="w-[500px] rounded-lg bg-white border shadow p-10">
          <img src={ASSETS.BRAND_LOGO} alt="brand-logo.png" className="h-[180px] w-auto mx-auto mb-5" />
          <Box className="text-center">
            <h1 className="text-xl text-black font-bold">{STATIC_TEXT.SCHOOL_NAME_ACRONYM} Attendance Software</h1>
            <p className="font-medium">Dashboard Login</p>
          </Box>

          <form className="mt-10">
            <Flex direction="column" gap="2">
              <Flex direction="column" gap="1">
                <p>E-mail address</p>
                <TextField.Root type="email" className="!h-[40px]" autoFocus />
              </Flex>

              <Flex direction="column" gap="1">
                <p>Password</p>
                <TextField.Root type="email" className="!h-[40px]" />
              </Flex>

              <a href="#" className="text-sm text-blue-500 my-3">
                Reset Password
              </a>

              <Button type="submit" className="!h-[40px]">
                Log In
              </Button>
            </Flex>
          </form>
        </Box>

        <p className="text-gray-800">All Rights Reserved &copy; {currentYear}</p>
      </Flex>
    </Theme>
  );
};
