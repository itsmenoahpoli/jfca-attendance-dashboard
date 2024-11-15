import React from "react";
import { Theme, Flex, Box } from "@radix-ui/themes";
import { FiHome, FiCodepen, FiUsers, FiClock, FiUserCheck } from "react-icons/fi";
import { Outlet, useNavigate } from "react-router-dom";
import { ASSETS } from "@/constants";

type SidebarItem = {
  icon?: JSX.Element;
  url: string;
  label: string;
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    icon: <FiHome size={20} />,
    url: "/dashboard",
    label: "Dashboard Overview",
  },
  {
    icon: <FiCodepen size={20} />,
    url: "/dashboard/manage/announcements",
    label: "Announcements Management",
  },
  {
    icon: <FiUsers size={20} />,
    url: "/dashboard/manage/students",
    label: "Students Management",
  },
  {
    icon: <FiClock size={20} />,
    url: "/dashboard/manage/attendance",
    label: "Attendance Management",
  },
  {
    icon: <FiUserCheck size={20} />,
    url: "/dashboard/manage/accounts",
    label: "Accounts Management",
  },
];

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleRedirect = (url: string) => {
    navigate(url);
  };

  const isButtonActive = (url: string) => {
    return window.location.pathname === url;
  };

  return (
    <Theme appearance="light" className="h-screen w-screen bg-slate-200">
      <Flex className="h-full w-full relative">
        <Box className="h-screen w-[300px] bg-slate-200 fixed p-5">
          <img src={ASSETS.BRAND_LOGO} alt="jfca.png" className="h-[150px] w-auto mx-auto mb-5" />
          <h1 className="text-xl text-gray-700 text-center font-bold">JFCA Attendance Monitoring Dashboard</h1>

          <Box className="w-full flex flex-col gap-y-2 mt-10">
            {SIDEBAR_ITEMS.map((item: SidebarItem) => (
              <button
                key={`sidebar-btn-${item.url}`}
                className={`w-full flex flex-row gap-x-3 items-center text-sm text-left rounded-lg py-3 px-4 hover:bg-blue-600 hover:text-white ${
                  isButtonActive(item.url) ? "bg-blue-600 text-white" : ""
                }`}
                onClick={() => handleRedirect(item.url)}
              >
                <span className="mb-1">{item.icon}</span> {item.label}
              </button>
            ))}
          </Box>
        </Box>
        <Box className="h-screen w-full bg-white ml-[300px] ">
          <Box className="h-full w-full p-5;">
            <Outlet />
          </Box>
        </Box>
      </Flex>
    </Theme>
  );
};
