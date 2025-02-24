import React from "react";
import { Flex } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { SidebarButton } from "./SidebarButton";
import { useLayout } from "@/hooks";
import { FORMATTERS } from "@/utils";
import { type SidebarGroup } from "@/types/layout";

type Props = {
  groupName: string;
  children: SidebarGroup["children"];
  hideLabels?: boolean;
};

export const SidebarLinksGroup: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const { isMobileScreen } = useLayout();
  const [toggled, setToggled] = React.useState<boolean>(false);

  const handleClickItem = (url?: string) => {
    return url ? navigate(url) : handleToggle();
  };

  const handleToggle = () => {
    setToggled((prevState) => !prevState);
  };

  return (
    <Flex direction="column" gap="2" justify="center" className="mb-3">
      <small
        className={`${
          props.hideLabels ? "text-[10px] text-center" : "text-[10px]"
        } !text-white font-bold`}
      >
        {props.groupName}
      </small>
      {props.children.map((child) => (
        <div className="flex flex-col" key={FORMATTERS.slugifyString(child.url || child.label)}>
          <SidebarButton
            data={child}
            toggled={toggled}
            handleToggle={handleToggle}
            handleClickItem={handleClickItem}
            hideLabels={props.hideLabels}
            asDropdown={isMobileScreen}
          />

          {child.children?.length ? (
            <Flex
              className={`${
                toggled ? "max-h-96" : "max-h-0"
              } transition-all duration-300 border-l border-slate-500 overflow-hidden pl-3`}
              direction="column"
              gap="3"
            >
              {child.children.map((child) => (
                <SidebarButton
                  data={child}
                  handleToggle={handleToggle}
                  handleClickItem={handleClickItem}
                  hideLabels={props.hideLabels}
                />
              ))}
            </Flex>
          ) : null}
        </div>
      ))}
    </Flex>
  );
};
