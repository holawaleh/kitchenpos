"use client";

import Link from "next/link";

import { useAuthStore } from "@/store/auth.store";

export function UserMenu() {
  const user =
    useAuthStore(
      (state) => state.user
    );

  const logout =
    useAuthStore(
      (state) => state.logout
    );

  return (
    <div
      className="
        flex items-center gap-3
      "
    >
      <div className="text-right">
        <p
          className="
            text-sm font-semibold
          "
        >
          {user?.full_name ||
            "Kitchen POS"}
        </p>

        <p
          className="
            text-xs uppercase
            opacity-70
          "
        >
          {user?.role ||
            "SUPERADMIN"}
        </p>
      </div>

      <Link
        href="/change-password"
        className="
          hidden rounded-xl
          border border-zinc-300
          px-3 py-2
          text-xs font-bold
          sm:block
        "
      >
        Password
      </Link>

      <button
        onClick={logout}
        className="
          rounded-xl
          bg-zinc-100
          px-3 py-2
          text-xs font-bold
        "
      >
        Logout
      </button>
    </div>
  );
}
