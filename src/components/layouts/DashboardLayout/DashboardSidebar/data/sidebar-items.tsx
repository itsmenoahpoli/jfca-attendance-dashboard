import { Command } from "lucide-react";
import { WEB_ROUTES } from "@/constants";
import { type SidebarGroup } from "@@types/layout";

const ICON_SIZE: number = 18;
// const SUB_ICON_SIZE: number = 15;

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
        label: "Classes/Sections Management",
        url: WEB_ROUTES.DASHBOARD_CLASSES,
        icon: <Command className="text-green-200" size={ICON_SIZE} />,
      },
      {
        label: "Students Management",
        url: WEB_ROUTES.DASHBOARD_STUDENTS,
        icon: <Command className="text-green-200" size={ICON_SIZE} />,
      },
      {
        label: "Attendance Reports",
        url: WEB_ROUTES.DASHBOARD_ATTENDANCE_REPORTS,
        icon: <Command className="text-green-200" size={ICON_SIZE} />,
      },
      // {
      //   label: "Data Management",
      //   icon: <Activity className="text-green-200" size={ICON_SIZE} />,
      //   children: [
      //     {
      //       label: "Manage Sections/Classes",
      //       url: "",
      //       icon: <SquarePen className="text-green-200" size={SUB_ICON_SIZE} />,
      //     },
      //     {
      //       label: "Manage Students",
      //       url: "",
      //       icon: <SquarePen className="text-green-200" size={SUB_ICON_SIZE} />,
      //     },
      //     {
      //       label: "Manage Attendance Reports",
      //       url: "",
      //       icon: <SquarePen className="text-green-200" size={SUB_ICON_SIZE} />,
      //     },
      //   ],
      // },
    ],
  },
] as const;
