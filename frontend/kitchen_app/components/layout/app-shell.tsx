import { ReactNode } from "react";

import { Sidebar } from "./sidebar";

import { Topbar } from "./topbar";

import { MobileNav } from "./mobile-nav";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({
  children,
}: AppShellProps) {
  return (
    <div
      className="
        flex
        min-h-screen
        w-full
        overflow-hidden
      "
      style={{
        background:
          "var(--background)",

        color:
          "var(--foreground)",
      }}
    >
      <Sidebar />

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
        "
      >
        <Topbar />

        <main
          className="
            min-w-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            p-4
            pb-24
            sm:p-6
            lg:pb-6
          "
        >
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
