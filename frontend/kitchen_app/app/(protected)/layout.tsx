import { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";

import { AuthGuard } from "../../components/auth/auth-guard";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  return (
    <AuthGuard>
      <AppShell>
        {children}
      </AppShell>
    </AuthGuard>
  );
}