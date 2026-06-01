import type {
  LucideIcon,
} from "lucide-react";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  BarChart3,
  Receipt,
  Settings,
} from "lucide-react";

export interface NavigationItem {

  title: string;

  href: string;

  icon: LucideIcon;

  roles: string[];
}

export const navigationItems:
NavigationItem[] = [

  {
    title: "Dashboard",

    href: "/dashboard",

    icon:
      LayoutDashboard,

    roles: [
      "SUPERADMIN",
      "MANAGER",
      "CASHIER",
      "INVENTORY",
    ],
  },

  {
    title: "POS",

    href: "/pos",

    icon:
      ShoppingCart,

    roles: [
      "SUPERADMIN",
      "MANAGER",
      "CASHIER",
    ],
  },

  {
    title: "Sales",

    href: "/sales",

    icon:
      Receipt,

    roles: [
      "SUPERADMIN",
      "MANAGER",
      "CASHIER",
    ],
  },

  {
    title: "Products",

    href: "/products",

    icon:
      Package,

    roles: [
      "SUPERADMIN",
      "MANAGER",
      "INVENTORY",
    ],
  },

  {
    title: "Inventory",

    href:
      "/inventory",

    icon:
      Warehouse,

    roles: [
      "SUPERADMIN",
      "MANAGER",
      "INVENTORY",
    ],
  },

  {
    title: "Reports",

    href:
      "/reports/revenue",

    icon:
      BarChart3,

    roles: [
      "SUPERADMIN",
      "MANAGER",
    ],
  },

  {
    title: "Settings",

    href:
      "/settings",

    icon:
      Settings,

    roles: [
      "SUPERADMIN",
    ],
  },
];
