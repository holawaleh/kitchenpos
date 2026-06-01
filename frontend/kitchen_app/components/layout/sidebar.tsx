"use client";

import Link from "next/link";

import { usePathname }
from "next/navigation";

import {
  navigationItems,
} from "@/constants/navigation";

import {
  useAuthStore,
} from "@/store/auth.store";

export function Sidebar() {

  const pathname =
    usePathname();

  const user =
    useAuthStore(
      (state) => state.user
    );

  const currentRole =
    String(
      user?.role || "SUPERADMIN"
    )
      .replace(/\s/g, "")
      .toUpperCase();

  const filteredItems =
    navigationItems.filter(
      (item) =>
        item.roles.includes(
          currentRole
        )
    );

  return (
    <aside
      className="
        w-64 border-r
      "
      style={{
        background:
          "var(--sidebar)",

        borderColor:
          "var(--sidebar-border)",
      }}
    >

      {/* HEADER */}

      <div
        className="
          flex h-16
          items-center
          border-b px-6
        "
        style={{
          borderColor:
            "var(--sidebar-border)",
        }}
      >

        <h1
          className="
            text-lg
            font-bold
          "
          style={{
            color:
              "var(--primary)",
          }}
        >
          Kitchen POS
        </h1>
      </div>

      {/* USER */}

      <div
        className="
          border-b p-4
        "
        style={{
          borderColor:
            "var(--sidebar-border)",
        }}
      >

        <p
          className="
            text-sm
            text-zinc-500
          "
        >
          Access mode
        </p>

        <h2
          className="
            mt-1
            font-bold
          "
        >
          {
            user?.full_name ||
            "Kitchen POS"
          }
        </h2>

        <span
          className="
            mt-2 inline-block
            rounded-full
            bg-cyan-100
            px-3 py-1
            text-xs
            font-bold
            text-cyan-700
          "
        >
          {
            currentRole ||
            "SUPERADMIN"
          }
        </span>
      </div>

      {/* NAVIGATION */}

      <nav
        className="
          space-y-2 p-4
        "
      >

        {filteredItems.map(
          (item) => {

            const Icon =
              item.icon;

            const active =
              pathname ===
              item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center
                  gap-3
                  rounded-xl
                  px-4 py-3
                  transition-all
                  duration-200

                  ${
                    active
                      ? "bg-cyan-500 text-white"
                      : ""
                  }
                `}
                style={{
                  color: active
                    ? "#ffffff"
                    : "var(--foreground)",
                }}
              >

                <Icon
                  size={18}
                />

                <span>
                  {
                    item.title
                  }
                </span>
              </Link>
            );
          }
        )}
      </nav>
    </aside>
  );
}
