"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { navigationItems } from "@/constants/navigation";

import { useAuthStore } from "@/store/auth.store";

export function MobileNav() {
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);

  const currentRole = String(user?.role || "SUPERADMIN")
    .replace(/\s/g, "")
    .toUpperCase();

  const filteredItems = navigationItems.filter((item) =>
    item.roles.includes(currentRole)
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {filteredItems.slice(0, 5).map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center rounded-2xl text-[11px] font-semibold transition ${
                active
                  ? "bg-cyan-500 text-white"
                  : "text-zinc-600 active:bg-zinc-100"
              }`}
              aria-label={item.title}
            >
              <Icon size={20} />
              <span className="mt-1 max-w-full truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
