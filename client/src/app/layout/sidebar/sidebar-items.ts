import { RouteInfo } from "./sidebar.metadata";

export const ROUTES: RouteInfo[] = [
  {
    path: "",
    title: "MENU",
    moduleName: "",
    icon: "",
    class: "header",
    groupTitle: true,
    submenu: [],
    role: "",
  },
  {
    path: "",
    title: "Home",
    moduleName: "dashboard",
    icon: "monitor",
    class: "menu-toggle",
    groupTitle: false,
    role: "",
    submenu: [
      {
        path: "/dashboard/main",
        title: "Dashboard",
        moduleName: "dashboard",
        icon: "",
        class: "ml-menu",
        groupTitle: false,
        submenu: [],
        role: "Doctor",
      },
      {
        path: "/dashboard/HospitalDashboard",
        title: "Dashboard",
        moduleName: "dashboard",
        icon: "",
        class: "ml-menu",
        groupTitle: false,
        submenu: [],
        role: "Hospital",
      },
    ],
  },

  {
    path: "",
    title: "Profile Settings",
    moduleName: "doctors",
    icon: "settings",
    class: "menu-toggle",
    groupTitle: false,
    role: "",
    submenu: [
      {
        path: "doctors/profile-settings",
        title: "Update Profile",
        moduleName: "doctors",
        icon: "",
        class: "ml-menu",
        groupTitle: false,
        submenu: [],
        role: "Doctor",
      },
    ],
  },
];
