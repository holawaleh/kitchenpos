"use client";

import { useAuthStore } from "@/store/auth.store";

export function UserMenu() {
  const user =
    useAuthStore(
      (state) => state.user
    );

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
    </div>
  );
}
