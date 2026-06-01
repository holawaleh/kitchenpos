"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { AxiosError } from "axios";

import { login } from "@/services/auth/auth.service";

import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();

  const setAuth =
    useAuthStore(
      (state) => state.setAuth
    );

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      const response =
        await login({
          username,
          password,
        });

      setAuth(
        response.data.access,
        response.data.refresh,
        response.data.user
      );

      toast.success(
        "Login successful"
      );

      if (
        response.data
          .must_change_password
      ) {

        router.push(
          "/change-password"
        );

        return;
      }

      router.push(
        "/dashboard"
      );
    } catch (error) {
      console.error(error);

      const axiosError =
        error as AxiosError<{
          detail?: string;
          message?: string;
        }>;

      const message =
        axiosError?.response?.data
          ?.detail ||
        axiosError?.response?.data
          ?.message ||
        "Login failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        flex min-h-screen
        items-center justify-center
        px-4
      "
    >
      <div
        className="
          w-full max-w-md
          rounded-2xl border p-8
        "
        style={{
          background:
            "var(--card)",

          borderColor:
            "var(--sidebar-border)",
        }}
      >
        <div className="mb-8">
          <h1
            className="
              text-3xl font-bold
            "
          >
            Kitchen Connect
          </h1>

          <p className="mt-2 opacity-70">
            Sign in to continue
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label
              className="
                mb-2 block text-sm
              "
            >
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              className="
                w-full rounded-xl
                border px-4 py-3
                outline-none
                placeholder:text-zinc-400
              "
              style={{
                background:
                  "var(--background)",

                borderColor:
                  "var(--sidebar-border)",

                color:
                  "var(--foreground)",
              }}
            />
          </div>

          <div>
            <label
              className="
                mb-2 block text-sm
              "
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="
                w-full rounded-xl
                border px-4 py-3
                outline-none
                placeholder:text-zinc-400
              "
              style={{
                background:
                  "var(--background)",

                borderColor:
                  "var(--sidebar-border)",

                color:
                  "var(--foreground)",
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="
              w-full rounded-xl
              bg-cyan-500 py-3
              font-semibold text-white
              transition-all duration-200
              hover:opacity-90
              disabled:opacity-50
            "
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
