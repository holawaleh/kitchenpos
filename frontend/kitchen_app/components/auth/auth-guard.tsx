"use client";

import { ReactNode, useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const pathname = usePathname();

  const accessToken = useAuthStore((state) => state.accessToken);

  const mustChangePassword = useAuthStore((state) => state.mustChangePassword);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");

      return;
    }

    if (mustChangePassword && pathname !== "/change-password") {
      router.replace("/change-password");

      return;
    }

    setReady(true);
  }, [accessToken, mustChangePassword, pathname, router]);

  if (!ready || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
        Checking access...
      </div>
    );
  }

  return children;
}
