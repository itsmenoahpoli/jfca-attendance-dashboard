import { atomWithStorage } from "jotai/utils";
import { storeStorage } from "./util";
import { type LayoutStoreData } from "@@types/layout";

export const layoutStoreAtom = atomWithStorage<LayoutStoreData>(
  "layoutData",
  {
    sidebarCollapsed: false,
  },
  storeStorage<LayoutStoreData>()
);
