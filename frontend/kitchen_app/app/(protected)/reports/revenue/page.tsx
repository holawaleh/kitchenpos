"use client";

import { useEffect, useMemo, useState }
from "react";

import {
  DollarSign,
  Receipt,
  TrendingUp,
} from "lucide-react";

import apiClient
from "@/lib/api-client";

import {
  getRevenueSummary,
} from "@/features/reports/services/report.service";

import {
  RevenueSummary,
} from "@/features/reports/types/report.types";

interface Sale {
  id: number;

  receipt_number: string;

  total_amount: string;

  paid_amount: string;

  balance: string;

  payment_status:
    | "PAID"
    | "PARTIAL"
    | "UNPAID";

  created_at: string;
}

export default function RevenuePage() {

  const [sales, setSales] =
    useState<Sale[]>([]);

  const [
    summary,
    setSummary,
  ] =
    useState<RevenueSummary | null>(
      null
    );

  const [
    activeSummary,
    setActiveSummary,
  ] = useState<
    | "today"
    | "total"
    | "paid"
    | "debt"
  >("today");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadSales() {

    try {

      const [
        response,
        revenueSummary,
      ] = await Promise.all([
        apiClient.get(
          "/sales/"
        ),
        getRevenueSummary(),
      ]);

      setSales(
        response.data.results || []
      );

      setSummary(
        revenueSummary
      );

    } catch (error) {

      console.error(error);

      setError(
        "Failed to load revenue analytics"
      );

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    loadSales();

  }, []);

  const analytics =
    useMemo(() => {

      const today =
        new Date()
          .toDateString();

      let revenueToday = 0;

      let totalRevenue = 0;

      let paidRevenue = 0;

      let outstandingDebt = 0;

      let todayTransactions = 0;

      sales.forEach(
        (sale) => {

          const total =
            Number(
              sale.total_amount
            );

          const paid =
            Number(
              sale.paid_amount
            );

          const balance =
            Number(
              sale.balance
            );

          totalRevenue +=
            total;

          paidRevenue +=
            paid;

          outstandingDebt +=
            balance;

          const saleDate =
            new Date(
              sale.created_at
            ).toDateString();

          if (
            saleDate === today
          ) {

            revenueToday +=
              total;

            todayTransactions +=
              1;
          }
        }
      );

      return {
        revenueToday:
          summary?.today_revenue ??
          revenueToday,
        totalRevenue:
          summary?.total_revenue ??
          totalRevenue,
        paidRevenue:
          summary?.paid_revenue ??
          paidRevenue,
        outstandingDebt:
          summary?.outstanding_debt ??
          outstandingDebt,
        todayTransactions:
          summary?.today_transactions ??
          todayTransactions,
      };

    }, [sales, summary]);

  const summaryDetails = {
    today: {
      title: "Today Revenue",
      amount:
        analytics.revenueToday,
      detail: `${analytics.todayTransactions} transaction(s) recorded today`,
    },
    total: {
      title: "Total Revenue",
      amount:
        analytics.totalRevenue,
      detail: `${summary?.total_transactions ?? sales.length} transaction(s) in total`,
    },
    paid: {
      title: "Paid Revenue",
      amount:
        analytics.paidRevenue,
      detail: `${summary?.paid_sales ?? 0} fully paid sale(s)`,
    },
    debt: {
      title: "Outstanding Debt",
      amount:
        analytics.outstandingDebt,
      detail: `${summary?.debt_sales ?? 0} sale(s) still have a balance`,
    },
  }[activeSummary];

  const revenueMixTotal =
    analytics.paidRevenue +
    analytics.outstandingDebt;

  const paidSliceDegrees =
    revenueMixTotal > 0
      ? Math.round(
          (analytics.paidRevenue /
            revenueMixTotal) *
            360
        )
      : 0;

  const recentSalesGraph =
    [...sales]
      .slice(0, 6)
      .reverse()
      .map((sale) => ({
        label:
          sale.receipt_number ||
          `Sale ${sale.id}`,
        total: Number(
          sale.total_amount
        ),
        paid: Number(
          sale.paid_amount
        ),
        balance: Number(
          sale.balance
        ),
      }));

  const maxRecentSale =
    Math.max(
      ...recentSalesGraph.map(
        (sale) => sale.total
      ),
      1
    );

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
        Loading analytics...
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

      <div>

        <h1
          className="
            text-5xl
            font-black
            tracking-tight
          "
        >
          Revenue Analytics
        </h1>

        <p
          className="
            mt-2
            text-lg
            text-zinc-500
          "
        >
          Financial overview
          and operational insights
        </p>
      </div>

      {/* ANALYTICS CARDS */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* REVENUE TODAY */}

        <button
          type="button"
          onClick={() =>
            setActiveSummary("today")
          }
          className="
            text-left
            rounded-[32px]
            border
            border-emerald-200
            bg-emerald-50
            p-6
          "
        >

          <div
            className="
              flex items-start
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-zinc-500
                "
              >
                Revenue Today
              </p>

              <h2
                className="
                  mt-4
                  text-4xl
                  font-black
                "
              >
                ₦
                {
                  analytics.revenueToday
                }
              </h2>
            </div>

            <div
              className="
                flex h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-emerald-100
              "
            >
              <DollarSign
                className="
                  h-7 w-7
                  text-emerald-700
                "
              />
            </div>
          </div>
        </button>

        {/* TOTAL REVENUE */}

        <button
          type="button"
          onClick={() =>
            setActiveSummary("total")
          }
          className="
            text-left
            rounded-[32px]
            border
            border-blue-200
            bg-blue-50
            p-6
          "
        >

          <div
            className="
              flex items-start
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-zinc-500
                "
              >
                Total Revenue
              </p>

              <h2
                className="
                  mt-4
                  text-4xl
                  font-black
                "
              >
                ₦
                {
                  analytics.totalRevenue
                }
              </h2>
            </div>

            <div
              className="
                flex h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-blue-100
              "
            >
              <TrendingUp
                className="
                  h-7 w-7
                  text-blue-700
                "
              />
            </div>
          </div>
        </button>

        {/* PAID REVENUE */}

        <button
          type="button"
          onClick={() =>
            setActiveSummary("paid")
          }
          className="
            text-left
            rounded-[32px]
            border
            border-violet-200
            bg-violet-50
            p-6
          "
        >

          <div
            className="
              flex items-start
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-zinc-500
                "
              >
                Paid Revenue
              </p>

              <h2
                className="
                  mt-4
                  text-4xl
                  font-black
                "
              >
                ₦
                {
                  analytics.paidRevenue
                }
              </h2>
            </div>

            <div
              className="
                flex h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-violet-100
              "
            >
              <Receipt
                className="
                  h-7 w-7
                  text-violet-700
                "
              />
            </div>
          </div>
        </button>

        {/* OUTSTANDING DEBT */}

        <button
          type="button"
          onClick={() =>
            setActiveSummary("debt")
          }
          className="
            text-left
            rounded-[32px]
            border
            border-red-200
            bg-red-50
            p-6
          "
        >

          <div
            className="
              flex items-start
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-zinc-500
                "
              >
                Outstanding Debt
              </p>

              <h2
                className="
                  mt-4
                  text-4xl
                  font-black
                  text-red-600
                "
              >
                ₦
                {
                  analytics.outstandingDebt
                }
              </h2>
            </div>

            <div
              className="
                flex h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-red-100
              "
            >
              <DollarSign
                className="
                  h-7 w-7
                  text-red-700
                "
              />
            </div>
          </div>
        </button>
      </div>

      <div
        className="
          rounded-[32px]
          border
          border-zinc-200
          bg-white
          p-6
        "
      >
        <p
          className="
            text-sm
            font-semibold
            text-zinc-500
          "
        >
          Selected Summary
        </p>

        <div
          className="
            mt-3
            flex
            flex-wrap
            items-end
            justify-between
            gap-4
          "
        >
          <div>
            <h2
              className="
                text-3xl
                font-black
              "
            >
              {
                summaryDetails.title
              }
            </h2>

            <p
              className="
                mt-2
                text-zinc-500
              "
            >
              {
                summaryDetails.detail
              }
            </p>
          </div>

          <p
            className="
              text-4xl
              font-black
            "
          >
            ₦
            {
              summaryDetails.amount
            }
          </p>
        </div>
      </div>

      {/* CHARTS */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          xl:grid-cols-2
        "
      >
        <div
          className="
            rounded-[32px]
            border
            border-zinc-200
            bg-white
            p-6
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              justify-between
              gap-6
            "
          >
            <div>
              <h2
                className="
                  text-2xl
                  font-black
                "
              >
                Revenue Mix
              </h2>

              <p
                className="
                  mt-1
                  text-zinc-500
                "
              >
                Paid revenue vs
                outstanding debt
              </p>
            </div>

            <div
              className="
                relative
                h-44
                w-44
                rounded-full
              "
              style={{
                background:
                  revenueMixTotal > 0
                    ? `conic-gradient(#10b981 0deg ${paidSliceDegrees}deg, #ef4444 ${paidSliceDegrees}deg 360deg)`
                    : "#e4e4e7",
              }}
            >
              <div
                className="
                  absolute
                  inset-8
                  flex
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-center
                  text-sm
                  font-bold
                  text-zinc-600
                "
              >
                {revenueMixTotal > 0
                  ? `${Math.round(
                      (analytics.paidRevenue /
                        revenueMixTotal) *
                        100
                    )}% paid`
                  : "No data"}
              </div>
            </div>
          </div>

          <div
            className="
              mt-6
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-2
            "
          >
            <div
              className="
                rounded-2xl
                bg-emerald-50
                p-4
              "
            >
              <p className="text-sm font-semibold text-zinc-500">
                Paid
              </p>
              <p className="mt-2 text-2xl font-black text-emerald-700">
                â‚¦
                {analytics.paidRevenue}
              </p>
            </div>

            <div
              className="
                rounded-2xl
                bg-red-50
                p-4
              "
            >
              <p className="text-sm font-semibold text-zinc-500">
                Outstanding
              </p>
              <p className="mt-2 text-2xl font-black text-red-600">
                â‚¦
                {analytics.outstandingDebt}
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            rounded-[32px]
            border
            border-zinc-200
            bg-white
            p-6
          "
        >
          <h2
            className="
              text-2xl
              font-black
            "
          >
            Recent Sales Graph
          </h2>

          <p
            className="
              mt-1
              text-zinc-500
            "
          >
            Last transactions by
            total value
          </p>

          <div className="mt-6 space-y-4">
            {recentSalesGraph.length === 0 ? (
              <p className="rounded-2xl bg-zinc-50 p-5 text-center text-zinc-500">
                No sales data yet
              </p>
            ) : (
              recentSalesGraph.map(
                (sale) => (
                  <div
                    key={sale.label}
                    className="space-y-2"
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        text-sm
                      "
                    >
                      <span className="font-semibold text-zinc-600">
                        {sale.label}
                      </span>
                      <span className="font-bold">
                        â‚¦
                        {sale.total}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full bg-cyan-500"
                        style={{
                          width: `${Math.max(
                            (sale.total /
                              maxRecentSale) *
                              100,
                            4
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}

      <div
        className="
          overflow-hidden
          rounded-[32px]
          border
          border-zinc-200
          bg-white
        "
      >

        <div
          className="
            border-b
            border-zinc-200
            p-6
          "
        >

          <h2
            className="
              text-2xl
              font-black
            "
          >
            Revenue Transactions
          </h2>

          <p
            className="
              mt-1
              text-zinc-500
            "
          >
            Financial activity
            overview
          </p>
        </div>

        <div className="overflow-x-auto">

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
                  Receipt
                </th>

                <th className="px-6 py-5">
                  Total
                </th>

                <th className="px-6 py-5">
                  Paid
                </th>

                <th className="px-6 py-5">
                  Balance
                </th>

                <th className="px-6 py-5">
                  Status
                </th>

                <th className="px-6 py-5">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>

              {sales.map(
                (sale) => (

                  <tr
                    key={sale.id}
                    className="
                      border-b
                      border-zinc-100
                      hover:bg-zinc-50
                    "
                  >

                    <td
                      className="
                        px-6 py-5
                        font-bold
                      "
                    >
                      {
                        sale.receipt_number
                      }
                    </td>

                    <td
                      className="
                        px-6 py-5
                        font-bold
                      "
                    >
                      ₦
                      {
                        sale.total_amount
                      }
                    </td>

                    <td
                      className="
                        px-6 py-5
                        font-bold
                        text-emerald-600
                      "
                    >
                      ₦
                      {
                        sale.paid_amount
                      }
                    </td>

                    <td
                      className="
                        px-6 py-5
                        font-bold
                        text-red-500
                      "
                    >
                      ₦
                      {
                        sale.balance
                      }
                    </td>

                    <td className="px-6 py-5">

                      <span
                        className={`
                          rounded-full
                          px-3 py-1
                          text-xs
                          font-bold

                          ${
                            sale.payment_status ===
                            "PAID"
                              ? "bg-emerald-100 text-emerald-700"
                              : sale.payment_status ===
                                "PARTIAL"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                      >
                        {
                          sale.payment_status
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
                        sale.created_at
                      ).toLocaleString()}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
