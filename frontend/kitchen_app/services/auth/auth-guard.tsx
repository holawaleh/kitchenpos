"use client";

import {
  useEffect,
  useState,
} from "react";

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

  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

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
    return null;
  }

  if (!accessToken) {
    return null;
  }

  return children;
}