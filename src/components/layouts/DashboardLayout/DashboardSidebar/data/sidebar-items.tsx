import { Activity, BookOpenCheck, Command, SquarePen } from "lucide-react";
import { type SidebarGroup } from "@@types/layout";
import { WEB_ROUTES } from "@/constants";

const ICON_SIZE: number = 18;
const SUB_ICON_SIZE: number = 15;

export const SIDEBAR_ITEMS: SidebarGroup[] = [
  {
    group: "Menu",
    children: [
      {
        label: "Dashboard Overview",
        url: WEB_ROUTES.DASHBOARD_OVERVIEW,
        icon: <Command className="text-green-200" size={ICON_SIZE} />,
      },
      {
        label: "Item w/ sub-items",
        icon: <Activity className="text-green-200" size={ICON_SIZE} />,
        children: [
          {
            label: "Sub-item 1",
            url: "",
            icon: <SquarePen className="text-green-200" size={SUB_ICON_SIZE} />,
          },
          {
            label: "Sub-item 2",
            url: "",
            icon: (
              <BookOpenCheck className="text-green-200" size={SUB_ICON_SIZE} />
            ),
          },
        ],
      },
    ],
  },
] as const;
