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
  // Doctor dashboard
  {
    path: "",
    title: "Home",
    moduleName: "doctors",
    icon: "monitor",
    class: "menu-toggle",
    groupTitle: false,
    role: "Doctor",
    submenu: [
      {
        path: "doctors/main",
        title: "Dashboard",
        moduleName: "doctors",
        icon: "",
        class: "ml-menu",
        groupTitle: false,
        submenu: [],
        role: "Doctor",
      },
      {
        path: "doctors/appointments",
        title: "Manage Appointments",
        moduleName: "doctors",
        icon: "",
        class: "ml-menu",
        groupTitle: false,
        submenu: [],
        role: "Doctor",
      },
    ],
  },
  // doctor prof,app...
  {
    path: "",
    title: "Profile Settings",
    moduleName: "doctors",
    icon: "settings",
    class: "menu-toggle",
    groupTitle: false,
    role: "Doctor",
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

  // Hospital dashboard
  {
    path: "",
    title: "Home",
    moduleName: "hospitals",
    icon: "monitor",
    class: "menu-toggle",
    groupTitle: false,
    role: "Hospital",
    submenu: [
      {
        path: "/hospitals/HospitalDashboard",
        title: "Dashboard",
        moduleName: "hospitals",
        icon: "",
        class: "ml-menu",
        groupTitle: false,
        submenu: [],
        role: "Hospital",
      },
    ],
  },
];
