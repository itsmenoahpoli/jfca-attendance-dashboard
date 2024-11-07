import React from "react";
import { Theme, Flex, Button } from "@radix-ui/themes";
import { ASSETS } from "@/constants";

const ErrorPage: React.FC = () => {
  console.error("PAGE NOT FOUND");

  return (
    <Theme>
      <Flex className="h-screen w-screen" direction="column" align="center" justify="center">
        <img src={ASSETS.WARNING_LOGO} alt="warning-logo.png" className="h-[250px] w-auto" />
        <h1 className="text-[72px] font-bold text-gray-800">404</h1>
        <h1 className="text-2xl font-bold">PAGE NOT FOUND</h1>
        <Button className="mt-4">GO HOME</Button>
      </Flex>
    </Theme>
  );
};

export default ErrorPage;
