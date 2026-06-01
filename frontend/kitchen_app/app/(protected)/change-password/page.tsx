"use client";

import { useState }
from "react";

import { useRouter }
from "next/navigation";

import apiClient
from "@/lib/api-client";

import {
  getApiErrorMessage,
} from "@/services/api/client";

import {
  useAuthStore,
} from "@/store/auth.store";

export default function ChangePasswordPage() {

  const router =
    useRouter();

  const user =
    useAuthStore(
      (state) => state.user
    );

  const accessToken =
    useAuthStore(
      (state) => state.accessToken
    );

  const refreshToken =
    useAuthStore(
      (state) => state.refreshToken
    );

  const setAuth =
    useAuthStore(
      (state) => state.setAuth
    );

  const [
    oldPassword,
    setOldPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      await apiClient.post(
        "/accounts/change-password/",
        {
          old_password:
            oldPassword,

          new_password:
            newPassword,
        }
      );

      if (
        accessToken &&
        refreshToken &&
        user
      ) {
        setAuth(
          accessToken,
          refreshToken,
          user,
          false
        );
      }

      router.push(
        "/dashboard"
      );

    } catch (error: any) {

      console.error(error);

      setError(
        getApiErrorMessage(
          error,
          "Password change failed"
        )
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <div
      className="
        flex min-h-screen
        items-center
        justify-center
        bg-zinc-100
        p-6
      "
    >

      <div
        className="
          w-full
          max-w-md
          rounded-[32px]
          bg-white
          p-8
          shadow-xl
        "
      >

        <div className="text-center">

          <h1
            className="
              text-4xl
              font-black
            "
          >
            Change Password
          </h1>

          <p
            className="
              mt-3
              text-zinc-500
            "
          >
            You must change your
            temporary password
            before continuing
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="
            mt-8
            space-y-5
          "
        >

          {/* OLD PASSWORD */}

          <div>

            <label
              className="
                mb-2 block
                text-sm
                font-bold
              "
            >
              Temporary Password
            </label>

            <input
              type="password"
              value={oldPassword}
              onChange={(e) =>
                setOldPassword(
                  e.target.value
                )
              }
              required
              className="
                h-14
                w-full
                rounded-2xl
                border
                border-zinc-300
                px-4
                outline-none
              "
            />
          </div>

          {/* NEW PASSWORD */}

          <div>

            <label
              className="
                mb-2 block
                text-sm
                font-bold
              "
            >
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              required
              className="
                h-14
                w-full
                rounded-2xl
                border
                border-zinc-300
                px-4
                outline-none
              "
            />
          </div>

          {/* ERROR */}

          {error && (

            <div
              className="
                rounded-2xl
                bg-red-100
                p-4
                text-sm
                font-bold
                text-red-700
              "
            >
              {error}
            </div>
          )}

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              h-14
              w-full
              rounded-2xl
              bg-black
              font-bold
              text-white
              disabled:opacity-40
            "
          >
            {loading
              ? "Updating..."
              : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
