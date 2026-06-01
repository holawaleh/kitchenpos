"use client";

import { LogOut } from "lucide-react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

export function UserMenu() {
  const router = useRouter();

  const user =
    useAuthStore(
      (state) => state.user
    );

  const logout =
    useAuthStore(
      (state) => state.logout
    );

  function handleLogout() {
    logout();

    router.push("/login");
  }

  if (!user) {
    return null;
  }

  return (
    <div
      className="
        flex items-center gap-4
      "
    >
      <div className="text-right">
        <p
          className="
            text-sm font-semibold
          "
        >
          {user.full_name}
        </p>

        <p
          className="
            text-xs uppercase
            opacity-70
          "
        >
          {user.role}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="
          flex h-10 w-10
          items-center
          justify-center
          rounded-xl border
          transition-all duration-200
          hover:bg-red-500
          hover:text-white
        "
        style={{
          borderColor:
            "var(--sidebar-border)",
        }}
      >
        <LogOut size={18} />
      </button>
    </div>
  );
}