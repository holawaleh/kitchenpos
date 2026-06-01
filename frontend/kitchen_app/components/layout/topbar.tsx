"use client";

import { ThemeToggle } from "./theme-toggle";

import { UserMenu } from "./user-menu";

export function Topbar() {
  return (
    <header
      className="
        flex h-20 items-center
        justify-between border-b
        px-8
      "
      style={{
        borderColor:
          "var(--sidebar-border)",

        background:
          "var(--background)",
      }}
    >
      <div>
        <h1
          className="
            text-2xl font-bold
          "
        >
          Restaurant POS
        </h1>
      </div>

      <div
        className="
          flex items-center gap-4
        "
      >
        <ThemeToggle />

        <UserMenu />
      </div>
    </header>
  );
}