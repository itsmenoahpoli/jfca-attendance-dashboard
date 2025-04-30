import React from "react";
import { useLayoutStore } from "@/stores/layout.store";

export const useLayout = () => {
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);
  const { sidebarCollapsed, setSidebarCollapsed } = useLayoutStore();

  const toggleSidebar = (isCollapsed?: boolean) => {
    const collapsedBool: boolean = isCollapsed ?? !sidebarCollapsed;
    setSidebarCollapsed(collapsedBool);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileScreen]);

  return {
    sidebarCollapsed,
    toggleSidebar,
    screenWidth,
    isMobileScreen,
  };
};
