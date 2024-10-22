import React from "react";
import { Theme, Flex, Box } from "@radix-ui/themes";

export const AuthLayout: React.FC = () => {
  return (
    <Theme appearance="light">
      <Flex direction="column" justify="center" className="pt-[80px]">
        <Box>
          <h1>JFCA AMS</h1>
        </Box>
      </Flex>
    </Theme>
  );
};
