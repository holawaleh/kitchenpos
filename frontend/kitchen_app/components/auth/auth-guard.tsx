"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();

  const accessToken =
    useAuthStore(
      (state) =>
        state.accessToken
    );

  const hydrated =
    useAuthStore.persist.hasHydrated();

  useEffect(() => {
    if (
      hydrated &&
      !accessToken
    ) {
      router.push("/login");
    }
  }, [
    hydrated,
    accessToken,
    router,
  ]);

  if (!hydrated) {
    return (
      <div
        className="
          flex min-h-screen
          items-center
          justify-center
        "
      >
        <p className="text-sm opacity-70">
          Loading session...
        </p>
      </div>
    );
  }

  if (!accessToken) {
    return null;
  }

  return children;
}