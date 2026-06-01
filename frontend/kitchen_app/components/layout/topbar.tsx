"use client";

import { ThemeToggle } from "./theme-toggle";

import { UserMenu } from "./user-menu";

export function Topbar() {
  return (
    <header
      className="
        flex h-16 items-center
        justify-between border-b
        px-4
        sm:h-20
        sm:px-8
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
            text-xl font-bold
            sm:text-2xl
          "
        >
          Restaurant POS
        </h1>
      </div>

      <div
        className="
          flex items-center gap-2
          sm:gap-4
        "
      >
        <ThemeToggle />

        <UserMenu />
      </div>
    </header>
  );
}
