import React from "react";
import { Flex } from "@radix-ui/themes";
import { SigninForm, AppDivider } from "@/components";

export const SigninPage: React.FC = () => {
  return (
    <div className="h-full w-full">
      <h1 className="text-2xl text-center text-white font-bold">
        JFCA Attendance Monitoring System
      </h1>
      <p className="text-xs text-center text-gray-600 font-medium mb-6">
        Sign-in to your account
      </p>

      <Flex direction="column" gap="5">
        <Flex direction="column" gap="3">
          <Flex direction="column" align="center" justify="center" gap="3">
            <small className="text-gray-800 text-center">Scan QR code</small>
          </Flex>
        </Flex>

        <AppDivider label="OR" />
        <div>
          <SigninForm />
        </div>
      </Flex>
    </div>
  );
};
