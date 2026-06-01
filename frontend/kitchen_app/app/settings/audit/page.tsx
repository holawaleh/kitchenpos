"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  ScrollText,
  Search,
} from "lucide-react";

import apiClient from "@/lib/api-client";

interface AuditLog {
  id: number;
  user_name: string | null;
  action: string;
  target_type: string;
  target_id: number | null;
  description: string;
  created_at: string;
}

export default function AuditPage() {
  const [logs, setLogs] =
    useState<AuditLog[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [action, setAction] =
    useState("");

  async function loadAuditLogs() {
    try {
      setLoading(true);

      const response =
        await apiClient.get(
          "/audit/",
          {
            params: {
              search,
              action,
            },
          }
        );

      setLogs(
        response.data.results ||
        response.data ||
        []
      );

      setError("");
    } catch (error) {
      console.error(error);

      setError(
        "Failed to load audit logs"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAuditLogs();
  }, [search, action]);

  return (
    <div className="space-y-8">
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
            bg-orange-100
          "
        >
          <ScrollText
            className="
              h-8 w-8
              text-orange-700
            "
          />
        </div>

        <div>
          <Link
            href="/settings"
            className="
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
            Audit Logs
          </h1>

          <p
            className="
              mt-2
              text-lg
              text-zinc-500
            "
          >
            Operational activity and payment trail
          </p>
        </div>
      </div>

      <div
        className="
          flex
          flex-col
          gap-3
          rounded-[32px]
          border
          border-zinc-200
          bg-white
          p-5
          md:flex-row
        "
      >
        <div
          className="
            relative
            flex-1
          "
        >
          <Search
            className="
              absolute
              left-4
              top-1/2
              h-5
              w-5
              -translate-y-1/2
              text-zinc-400
            "
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search by staff name, username, description, target, or record ID"
            className="
              h-14
              w-full
              rounded-2xl
              border
              border-zinc-300
              bg-white
              pl-12
              pr-4
              outline-none
            "
          />
        </div>

        <select
          value={action}
          onChange={(event) =>
            setAction(
              event.target.value
            )
          }
          className="
            h-14
            rounded-2xl
            border
            border-zinc-300
            bg-white
            px-4
            outline-none
          "
        >
          <option value="">
            All Types
          </option>
          <option value="SALE_CREATED">
            Sale Created
          </option>
          <option value="PAYMENT_RECEIVED">
            Payment Received
          </option>
          <option value="REPAYMENT_RECEIVED">
            Repayment Received
          </option>
          <option value="STOCK_ADDED">
            Stock Added
          </option>
          <option value="STOCK_DEDUCTED">
            Stock Deducted
          </option>
          <option value="PRODUCT_CREATED">
            Product Created
          </option>
          <option value="PRODUCT_UPDATED">
            Product Updated
          </option>
          <option value="PRODUCT_DELETED">
            Product Deleted
          </option>
        </select>
      </div>

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
                Action
              </th>
              <th className="px-6 py-5">
                User
              </th>
              <th className="px-6 py-5">
                Target
              </th>
              <th className="px-6 py-5">
                Description
              </th>
              <th className="px-6 py-5">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="
                    py-16
                    text-center
                    text-zinc-500
                  "
                >
                  Loading audit logs...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={5}
                  className="
                    py-16
                    text-center
                    text-red-500
                  "
                >
                  {error}
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="
                    py-16
                    text-center
                    text-zinc-500
                  "
                >
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="
                    border-b
                    border-zinc-100
                  "
                >
                  <td
                    className="
                      px-6
                      py-5
                      font-bold
                    "
                  >
                    {log.action}
                  </td>
                  <td className="px-6 py-5">
                    {log.user_name || "System"}
                  </td>
                  <td className="px-6 py-5">
                    {log.target_type}
                    {log.target_id
                      ? ` #${log.target_id}`
                      : ""}
                  </td>
                  <td className="px-6 py-5">
                    {log.description}
                  </td>
                  <td
                    className="
                      px-6
                      py-5
                      text-sm
                      text-zinc-500
                    "
                  >
                    {new Date(
                      log.created_at
                    ).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
