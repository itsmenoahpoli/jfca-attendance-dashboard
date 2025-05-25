const AUTH_ROUTE_PREFIX = "/auth";
const DASHBOARD_ROUTE_PREFIX = "/dashboard";
const MODULE_ROUTE_PREFIX = "/module";

const appendAuthPrefix = (url: string) => {
  return `${AUTH_ROUTE_PREFIX}${url}`;
};

const appendDashboardPrefix = (url: string) => {
  return `${DASHBOARD_ROUTE_PREFIX}${url}`;
};

const appendModulePrefix = (url: string) => {
  return `${MODULE_ROUTE_PREFIX}${url}`;
};

const WEB_ROUTES = {
  INDEX: "/",
  SIGN_IN: appendAuthPrefix("/signin"),
  DASHBOARD_OVERVIEW: appendDashboardPrefix("/overview"),
  DASHBOARD_STUDENTS: appendDashboardPrefix("/students"),
  DASHBOARD_CLASSES: appendDashboardPrefix("/classes"),
  DASHBOARD_ATTENDANCE_REPORTS: appendDashboardPrefix("/attendance-reports"),
  DASHBOARD_USERS: appendDashboardPrefix("/users"),
  MODULE_ATTENDANCE: appendModulePrefix("/attendance"),
};

const API_ROUTES = {
  AUTH: {
    SIGN_IN: appendAuthPrefix("/signin"),
  },
  SECTIONS: {
    LIST: "/sections",
  },
};

export { AUTH_ROUTE_PREFIX, DASHBOARD_ROUTE_PREFIX, WEB_ROUTES, API_ROUTES };
