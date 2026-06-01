"use client";

import Link from "next/link";

import {
  Shield,
} from "lucide-react";

const roles = [
  {
    name: "SUPERADMIN",
    description:
      "Full access to sales, products, inventory, reports, staff, roles, and audit logs.",
    permissions: [
      "Dashboard",
      "POS",
      "Sales",
      "Products",
      "Inventory",
      "Reports",
      "Settings",
    ],
  },
  {
    name: "MANAGER",
    description:
      "Operational access for supervising sales, products, inventory, and reports.",
    permissions: [
      "Dashboard",
      "POS",
      "Sales",
      "Products",
      "Inventory",
      "Reports",
    ],
  },
  {
    name: "CASHIER",
    description:
      "Front-desk access for POS checkout and sales tracking.",
    permissions: [
      "Dashboard",
      "POS",
      "Sales",
    ],
  },
  {
    name: "INVENTORY",
    description:
      "Stockroom access for products and inventory management.",
    permissions: [
      "Dashboard",
      "Products",
      "Inventory",
    ],
  },
];

export default function RolesPage() {
  return (
    <div className="space-y-8">
      <div
        className="
          flex items-start
          gap-4
        "
      >
        <div
          className="
            flex h-16
            w-16
            items-center
            justify-center
            rounded-3xl
            bg-violet-100
          "
        >
          <Shield
            className="
              h-8 w-8
              text-violet-700
            "
          />
        </div>

        <div>
          <Link
            href="/settings"
            className="
              text-sm
              font-semibold
              text-zinc-500
            "
          >
            Back to Settings
          </Link>

          <h1
            className="
              mt-2
              text-5xl
              font-black
              tracking-tight
            "
          >
            Roles & Permissions
          </h1>

          <p
            className="
              mt-2
              text-lg
              text-zinc-500
            "
          >
            Current access structure used by the sidebar and settings area
          </p>
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-5
          xl:grid-cols-2
        "
      >
        {roles.map((role) => (
          <div
            key={role.name}
            className="
              rounded-[32px]
              border
              border-zinc-200
              bg-white
              p-6
            "
          >
            <h2
              className="
                text-2xl
                font-black
              "
            >
              {role.name}
            </h2>

            <p
              className="
                mt-2
                text-zinc-500
              "
            >
              {role.description}
            </p>

            <div
              className="
                mt-5
                flex
                flex-wrap
                gap-2
              "
            >
              {role.permissions.map((permission) => (
                <span
                  key={permission}
                  className="
                    rounded-full
                    bg-violet-50
                    px-3
                    py-1
                    text-xs
                    font-bold
                    text-violet-700
                  "
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
