"use client";

import {
  DollarSign,
  Package,
  AlertTriangle,
  Receipt,
  Wallet,
  ShoppingCart,
} from "lucide-react";

import { useRouter }
from "next/navigation";

import {
  useDashboardSummary,
} from "@/features/reports/hooks/use-dashboard-summary";

export default function DashboardPage() {

  const router =
    useRouter();

  const {
    summary,
    loading,
    error,
  } = useDashboardSummary();

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
        Loading dashboard...
      </div>
    );
  }

  if (error || !summary) {
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
        {error ||
          "Failed to load dashboard"}
      </div>
    );
  }

  const cards = [
    {
      title:
        "Revenue Today",

      value: `₦${summary.today_sales}`,

      icon: DollarSign,

      bg: "bg-emerald-50",

      border:
        "border-emerald-200",

      iconBg:
        "bg-emerald-100",

      iconColor:
        "text-emerald-700",

      route:
        "/reports/revenue",
    },

    {
      title:
        "Transactions",

      value:
        summary.today_transactions,

      icon: Receipt,

      bg: "bg-blue-50",

      border:
        "border-blue-200",

      iconBg:
        "bg-blue-100",

      iconColor:
        "text-blue-700",

      route:
        "/sales",
    },

    {
      title:
        "Products",

      value:
        summary.total_products,

      icon: Package,

      bg: "bg-violet-50",

      border:
        "border-violet-200",

      iconBg:
        "bg-violet-100",

      iconColor:
        "text-violet-700",

      route:
        "/products",
    },

    {
      title:
        "Low Stock",

      value:
        summary.low_stock_count,

      icon: AlertTriangle,

      bg: "bg-yellow-50",

      border:
        "border-yellow-200",

      iconBg:
        "bg-yellow-100",

      iconColor:
        "text-yellow-700",

      route:
        "/inventory/low-stock",
    },

    {
      title:
        "Unpaid Sales",

      value:
        summary.unpaid_sales_count,

      icon: ShoppingCart,

      bg: "bg-red-50",

      border:
        "border-red-200",

      iconBg:
        "bg-red-100",

      iconColor:
        "text-red-700",

      route:
        "/sales?status=UNPAID",
    },

    {
      title:
        "Outstanding Debt",

      value: `₦${summary.outstanding_balance}`,

      icon: Wallet,

      bg: "bg-orange-50",

      border:
        "border-orange-200",

      iconBg:
        "bg-orange-100",

      iconColor:
        "text-orange-700",

      route:
        "/reports/debts",
    },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <h1
          className="
                text-3xl
                font-black
                tracking-tight
                sm:text-5xl
          "
        >
          Dashboard
        </h1>

        <p
          className="
            mt-2
            text-base
            text-zinc-500
            sm:text-lg
          "
        >
          Operational overview
          and financial insights
        </p>
      </div>

      {/* CARDS */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {cards.map(
          (card) => {

            const Icon =
              card.icon;

            return (
              <button
                key={
                  card.title
                }
                onClick={() =>
                  router.push(
                    card.route
                  )
                }
                className={`
                  min-h-[150px]
                  rounded-2xl
                  border
                  p-4
                  text-left
                  transition-all
                  sm:rounded-[32px]
                  sm:p-6
                  hover:scale-[1.02]
                  hover:shadow-lg
                  active:scale-[0.99]

                  ${card.bg}
                  ${card.border}
                `}
              >
                <div
                  className="
                    flex
                    items-start
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
                      {
                        card.title
                      }
                    </p>

                    <h2
                      className="
                        mt-4
                        text-3xl
                        font-black
                        sm:text-4xl
                      "
                    >
                      {
                        card.value
                      }
                    </h2>
                  </div>

                  <div
                    className={`
                      flex h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      sm:h-14
                      sm:w-14
                      sm:rounded-2xl

                      ${card.iconBg}
                    `}
                  >
                    <Icon
                      className={`
                        h-7 w-7

                        ${card.iconColor}
                      `}
                    />
                  </div>
                </div>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}
