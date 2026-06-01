"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div
      className="
        flex min-h-screen
        items-center justify-center
        px-4
      "
    >
      <p className="text-sm opacity-70">
        Opening dashboard...
      </p>
    </div>
  );
}
