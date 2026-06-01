"use client";

import { Moon, Sun } from "lucide-react";

import {
  useTheme,
} from "@/components/theme-provider";

export function ThemeToggle() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  const isDark =
    theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="
        flex h-10 w-10 items-center
        justify-center rounded-full
        bg-cyan-500 text-white
        transition-all duration-200
        hover:scale-105
      "
    >
      {isDark ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}
