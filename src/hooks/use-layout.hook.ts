import React from "react";
import { useAtom } from "jotai";
import { layoutStoreAtom } from "@/stores";

export const useLayout = () => {
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);
  const [layoutStoreData, setLayoutStoreData] = useAtom(layoutStoreAtom);

  const toggleSidebar = (isCollapsed?: boolean) => {
    const collapsedBool: boolean = isCollapsed ? isCollapsed : !layoutStoreData.sidebarCollapsed;

    setLayoutStoreData({
      sidebarCollapsed: collapsedBool,
    });
  };

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  const isMobileScreen = screenWidth < 600;

  React.useEffect(() => {
    if (isMobileScreen) toggleSidebar(true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    sidebarCollapsed: layoutStoreData.sidebarCollapsed,
    toggleSidebar,
    screenWidth,
    isMobileScreen,
  };
};
