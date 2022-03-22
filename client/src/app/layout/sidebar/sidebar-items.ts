import { RouteInfo } from "./sidebar.metadata";

export const ROUTES: RouteInfo[] = [
  {
    path: "",
    title: "MENUITEMS.MAIN.TEXT",
    moduleName: "",
    icon: "",
    class: "header",
    groupTitle: true,
    submenu: [],
  },
  {
    path: "",
    title: "MENUITEMS.HOME.TEXT",
    moduleName: "dashboard",
    icon: "monitor",
    class: "menu-toggle",
    groupTitle: false,
    submenu: [
      {
        path: "/dashboard/main",
        title: "Dashboard",
        moduleName: "dashboard",
        icon: "",
        class: "ml-menu",
        groupTitle: false,
        submenu: [],
      },
      // {
      //   path: '/dashboard/dashboard2',
      //   title: 'MENUITEMS.HOME.LIST.DASHBOARD2',
      //   moduleName: 'dashboard',
      //   icon: '',
      //   class: 'ml-menu',
      //   groupTitle: false,
      //   submenu: []
      // },
      // {
      //   path: '/dashboard/dashboard3',
      //   title: 'MENUITEMS.HOME.LIST.DASHBOARD3',
      //   moduleName: 'dashboard',
      //   icon: '',
      //   class: 'ml-menu',
      //   groupTitle: false,
      //   submenu: []
      // }
    ],
  },

  {
    path: "",
    title: "Profile Settings",
    moduleName: "doctors",
    icon: "settings",
    class: "menu-toggle",
    groupTitle: false,
    submenu: [
      {
        path: "doctors/profile-settings",
        title: "Update Profile",
        moduleName: "doctors",
        icon: "",
        class: "ml-menu",
        groupTitle: false,
        submenu: [],
      },
    ],
  },
];
