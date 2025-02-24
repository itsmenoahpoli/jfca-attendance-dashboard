import { Flex } from "@radix-ui/themes";
import React from "react";

type Props = {
  label: string;
};

export const AppDivider: React.FC<Props> = (props) => {
  return (
    <Flex className="flex items-center w-full max-w-md" align="center">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="px-4 text-gray-500 text-sm">{props.label}</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </Flex>
  );
};
