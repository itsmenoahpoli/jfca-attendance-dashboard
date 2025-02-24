export type LayoutStoreData = {
  sidebarCollapsed: boolean;
};

export type BaseSidebarButton = {
  label: string;
  url?: string;
  icon?: JSX.Element;
  is_disabled?: boolean;
};

export type SidebarGroupSubItems = {
  children?: BaseSidebarButton[];
} & BaseSidebarButton;

export type SidebarGroup = {
  group: string;
  icon?: JSX.Element;
  children: SidebarGroupSubItems[];
};
