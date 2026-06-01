"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  Users,
  Plus,
  Copy,
  Check,
  Trash2,
} from "lucide-react";

import apiClient
from "@/lib/api-client";

interface Staff {

  id: number;

  full_name: string;

  username: string;

  role:
    | "SUPERADMIN"
    | "MANAGER"
    | "CASHIER"
    | "INVENTORY";

  is_active: boolean;

  created_at: string;
}

export default function StaffPage() {

  const [staff, setStaff] =
    useState<Staff[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [createOpen, setCreateOpen] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [
    generatedPassword,
    setGeneratedPassword,
  ] = useState("");

  const [
    form,
    setForm,
  ] = useState({
    full_name: "",
    username: "",
    email: "",
    role: "CASHIER",
  });

  async function loadStaff() {

    try {

      const response =
        await apiClient.get(
          "/accounts/staff/"
        );

      setStaff(
        response.data.data || []
      );

    } catch (error) {

      console.error(error);

      setError(
        "Failed to load staff"
      );

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    loadStaff();

  }, []);

  async function createStaff() {

    try {

      const response =
        await apiClient.post(
          "/accounts/staff/create/",
          form
        );

      setGeneratedPassword(
        response.data.data
          .temporary_password
      );

      setCreateOpen(false);

      setForm({
        full_name: "",
        username: "",
        email: "",
        role: "CASHIER",
      });

      loadStaff();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to create staff"
      );
    }
  }

  async function deleteStaff(
    user: Staff
  ) {
    const confirmed =
      window.confirm(
        `Delete ${user.full_name}? This will deactivate the staff account.`
      );

    if (!confirmed) {
      return;
    }

    try {
      await apiClient.delete(
        `/accounts/staff/${user.id}/`
      );

      await loadStaff();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to delete staff"
      );
    }
  }

  async function copyPassword() {

    await navigator.clipboard.writeText(
      generatedPassword
    );

    setCopied(true);

    setTimeout(() => {

      setCopied(false);

    }, 2000);
  }

  if (loading) {

    return (
      <div
        className="
          flex min-h-[400px]
          items-center
          justify-center
          text-xl
          font-semibold
          text-zinc-500
        "
      >
        Loading staff...
      </div>
    );
  }

  if (error) {

    return (
      <div
        className="
          flex min-h-[400px]
          items-center
          justify-center
          text-xl
          font-semibold
          text-red-500
        "
      >
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div
        className="
          flex items-start
          justify-between
        "
      >

        <div
          className="
            flex items-start
            gap-4
          "
        >

          <div
            className="
              flex h-16
              w-16
              items-center
              justify-center
              rounded-3xl
              bg-blue-100
            "
          >
            <Users
              className="
                h-8 w-8
                text-blue-700
              "
            />
          </div>

          <div>

            <Link
              href="/settings"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-zinc-500
              "
            >
              Back to Settings
            </Link>

            <h1
              className="
                mt-2
                text-5xl
                font-black
                tracking-tight
              "
            >
              Staff Management
            </h1>

            <p
              className="
                mt-2
                text-lg
                text-zinc-500
              "
            >
              Operational onboarding
              and role governance
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setCreateOpen(true)
          }
          className="
            flex items-center
            gap-2
            rounded-2xl
            bg-black
            px-6 py-4
            font-bold
            text-white
          "
        >
          <Plus
            className="
              h-5 w-5
            "
          />

          Add Staff
        </button>
      </div>

      {/* TABLE */}

      <div
        className="
          overflow-hidden
          rounded-[32px]
          border
          border-zinc-200
          bg-white
        "
      >

        <table className="w-full">

          <thead
            className="
              border-b
              border-zinc-200
              bg-zinc-50
            "
          >

            <tr
              className="
                text-left
                text-sm
                font-bold
                uppercase
                tracking-wide
                text-zinc-500
              "
            >

              <th className="px-6 py-5">
                Full Name
              </th>

              <th className="px-6 py-5">
                Username
              </th>

              <th className="px-6 py-5">
                Role
              </th>

              <th className="px-6 py-5">
                Status
              </th>

              <th className="px-6 py-5">
                Created
              </th>

              <th className="px-6 py-5">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {staff.map(
              (user) => (

                <tr
                  key={user.id}
                  className="
                    border-b
                    border-zinc-100
                  "
                >

                  <td
                    className="
                      px-6 py-5
                      font-bold
                    "
                  >
                    {user.full_name}
                  </td>

                  <td className="px-6 py-5">
                    {user.username}
                  </td>

                  <td className="px-6 py-5">

                    <span
                      className="
                        rounded-full
                        bg-blue-100
                        px-3 py-1
                        text-xs
                        font-bold
                        text-blue-700
                      "
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`
                        rounded-full
                        px-3 py-1
                        text-xs
                        font-bold

                        ${
                          user.is_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {
                        user.is_active
                          ? "ACTIVE"
                          : "DISABLED"
                      }
                    </span>
                  </td>

                  <td
                    className="
                      px-6 py-5
                      text-sm
                      text-zinc-500
                    "
                  >
                    {new Date(
                      user.created_at
                    ).toLocaleString()}
                  </td>

                  {/* ACTIONS */}

                  <td className="px-6 py-5">

                    <button
                      onClick={() =>
                        deleteStaff(user)
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-red-500
                        px-4 py-2
                        text-xs
                        font-bold
                        text-white
                      "
                    >
                      <Trash2
                        className="
                          h-4 w-4
                        "
                      />

                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}

      {createOpen && (

        <div
          className="
            fixed inset-0
            z-50
            flex items-center
            justify-center
            bg-black/40
            p-4
          "
        >

          <div
            className="
              w-full
              max-w-lg
              rounded-[32px]
              bg-white
              p-8
            "
          >

            <h2
              className="
                text-3xl
                font-black
              "
            >
              Create Staff
            </h2>

            <div
              className="
                mt-6
                space-y-4
              "
            >

              <input
                placeholder="Full name"
                value={form.full_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    full_name:
                      e.target.value,
                  })
                }
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

              <input
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username:
                      e.target.value,
                  })
                }
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

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email:
                      e.target.value,
                  })
                }
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

              <select
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role:
                      e.target.value,
                  })
                }
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-zinc-300
                  px-4
                  outline-none
                "
              >

                <option value="CASHIER">
                  CASHIER
                </option>

                <option value="MANAGER">
                  MANAGER
                </option>

                <option value="INVENTORY">
                  INVENTORY
                </option>

                <option value="SUPERADMIN">
                  SUPERADMIN
                </option>
              </select>
            </div>

            <div
              className="
                mt-8
                flex gap-3
              "
            >

              <button
                onClick={() =>
                  setCreateOpen(false)
                }
                className="
                  h-14
                  flex-1
                  rounded-2xl
                  border
                  border-zinc-300
                  font-bold
                "
              >
                Cancel
              </button>

              <button
                onClick={createStaff}
                className="
                  h-14
                  flex-1
                  rounded-2xl
                  bg-black
                  font-bold
                  text-white
                "
              >
                Create Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD DISPLAY */}

      {generatedPassword && (

        <div
          className="
            fixed bottom-6
            right-6
            z-50
            w-full
            max-w-md
            rounded-[32px]
            border
            border-emerald-200
            bg-white
            p-6
            shadow-2xl
          "
        >

          <h2
            className="
              text-2xl
              font-black
            "
          >
            Temporary Password
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-zinc-500
            "
          >
            Save this password now.
            It will not be shown again.
          </p>

          <div
            className="
              mt-5
              flex items-center
              justify-between
              rounded-2xl
              bg-zinc-100
              p-4
            "
          >

            <span
              className="
                font-mono
                text-lg
                font-bold
              "
            >
              {generatedPassword}
            </span>

            <button
              onClick={copyPassword}
              className="
                flex items-center
                gap-2
                rounded-xl
                bg-black
                px-4 py-2
                text-sm
                font-bold
                text-white
              "
            >

              {copied ? (
                <>
                  <Check
                    className="
                      h-4 w-4
                    "
                  />
                  Copied
                </>
              ) : (
                <>
                  <Copy
                    className="
                      h-4 w-4
                    "
                  />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
