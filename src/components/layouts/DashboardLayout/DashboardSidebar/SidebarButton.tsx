import React from "react";
import { Tooltip } from "@radix-ui/themes";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useLayout } from "@/hooks";
import { type SidebarGroupSubItems } from "@/types/layout";

type Props = {
  data: SidebarGroupSubItems;
  toggled?: boolean;
  handleClickItem: (url?: string) => void;
  handleToggle: () => void;
  hideLabels?: boolean;
  asDropdown?: boolean;
};

const CollapseIcon: React.FC<{ isCollapsed: boolean }> = (props) => {
  const CHEVRON_ICON_SIZE: number = 15;

  return props.isCollapsed ? (
    <ChevronUp className="text-white ml-auto" size={CHEVRON_ICON_SIZE} />
  ) : (
    <ChevronDown className="text-white ml-auto" size={CHEVRON_ICON_SIZE} />
  );
};

export const SidebarButton: React.FC<Props> = (props) => {
  const { sidebarCollapsed } = useLayout();

  return (
    <Tooltip content={props.data.label} hidden={!sidebarCollapsed}>
      <button
        className="flex flex-row items-center gap-x-2 hover:bg-slate-500 !hover:text-white cursor-pointer rounded-lg p-2"
        onClick={() => props.handleClickItem(props.data.url)}
      >
        <div
          className={`${props.hideLabels ? "w-full flex justify-center" : ""}`}
        >
          {props.data.icon}
        </div>

        {props.hideLabels ? null : (
          <p className="text-xs text-white">{props.data.label}</p>
        )}

        {props.data.children?.length && props.toggled !== undefined ? (
          <CollapseIcon isCollapsed={props.toggled} />
        ) : null}
      </button>
    </Tooltip>
  );
};
