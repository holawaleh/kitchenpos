"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { login } from "@/services/auth/auth.service";

import { getApiErrorMessage } from "@/services/api/client";

import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();

  const accessToken = useAuthStore((state) => state.accessToken);

  const setAuth = useAuthStore((state) => state.setAuth);

  const [username, setUsername] = useState("admin");

  const [password, setPassword] = useState("1234");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (accessToken) {
      router.replace("/dashboard");
    }
  }, [accessToken, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login({
        username,
        password,
      });

      setAuth(
        response.data.access,
        response.data.refresh,
        response.data.user,
        response.data.must_change_password
      );

      toast.success("Login successful");

      router.replace(
        response.data.must_change_password ? "/change-password" : "/dashboard"
      );
    } catch (err) {
      console.error(err);

      setError(
        getApiErrorMessage(
          err,
          "Login failed"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[28px] border border-zinc-200 bg-white p-6 shadow-xl sm:p-8"
      >
        <div>
          <h1 className="text-3xl font-black">Kitchen POS</h1>
          <p className="mt-2 text-zinc-500">Sign in to continue</p>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold">Username</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className="h-14 w-full rounded-2xl border border-zinc-300 px-4 outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="h-14 w-full rounded-2xl border border-zinc-300 px-4 outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 h-14 w-full rounded-2xl bg-cyan-500 font-bold text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
