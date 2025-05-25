import { Command, Users } from "lucide-react";
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
      {
        label: "User Management",
        url: WEB_ROUTES.DASHBOARD_USERS,
        icon: <Users className="text-green-200" size={ICON_SIZE} />,
      },
    ],
  },
] as const;
