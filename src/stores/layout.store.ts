import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LayoutStoreData } from "@@types/layout";

interface LayoutState extends LayoutStoreData {
  setSidebarCollapsed: (collapsed: boolean) => void;
  resetLayout: () => void;
}

const initialState: Omit<LayoutState, "setSidebarCollapsed" | "resetLayout"> = {
  sidebarCollapsed: false,
};

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      ...initialState,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      resetLayout: () => set(initialState),
    }),
    {
      name: "layout-storage",
    }
  )
);
