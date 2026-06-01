"use client";

import { ReactNode } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";

import { AppShell } from "@/components/layout/app-shell";

import { useAuthStore } from "@/store/auth.store";

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const user =
    useAuthStore(
      (state) => state.user
    );

  const role =
    String(user?.role || "")
      .replace(/\s/g, "")
      .toUpperCase();

  return (
    <AuthGuard>
      <AppShell>
        {role === "SUPERADMIN" ? (
          children
        ) : (
          <div
            className="
              flex min-h-[400px]
              items-center
              justify-center
              text-center
            "
          >
            <div>
              <h1
                className="
                  text-3xl
                  font-black
                "
              >
                Access restricted
              </h1>

              <p
                className="
                  mt-2
                  text-zinc-500
                "
              >
                Settings are only available to super admins.
              </p>
            </div>
          </div>
        )}
      </AppShell>
    </AuthGuard>
  );
}
