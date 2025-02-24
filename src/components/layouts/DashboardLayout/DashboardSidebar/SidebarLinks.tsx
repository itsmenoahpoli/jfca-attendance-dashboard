import React from "react";
import { Flex } from "@radix-ui/themes";
import { SidebarLinksGroup } from "./SidebarLinksGroup";
import { type SidebarGroup } from "@/types/layout";
import { FORMATTERS } from "@/utils";

type Props = {
  items: SidebarGroup[];
  hideLabels?: boolean;
};

export const SidebarLinks: React.FC<Props> = (props) => {
  return (
    <Flex direction="column" gap="2">
      {props.items.map((item) => (
        <SidebarLinksGroup
          key={FORMATTERS.slugifyString(item.group)}
          groupName={item.group}
          children={item.children}
          hideLabels={props.hideLabels}
        />
      ))}
    </Flex>
  );
};
