import React from "react";
import { Flex, Box, TextField, Button } from "@radix-ui/themes";
import { STATIC_TEXT } from "@/constants";

const LoginPage: React.FC = () => {
  return (
    <Box>
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
  );
};

export default LoginPage;
