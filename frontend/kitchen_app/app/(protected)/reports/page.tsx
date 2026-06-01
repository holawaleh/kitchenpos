"use client";

import {
  BarChart3,
  CreditCard,
  Wallet,
  TrendingUp,
} from "lucide-react";

import {
  useReports,
} from "@/features/reports/hooks/use-reports";

const formatCurrency = (value: number | string | undefined) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export default function ReportsPage() {
  const {
    dailySales,
    debtSummary,
    paymentSummary,
    topProducts,
    loading,
    error,
  } = useReports();

  const paymentChartData = [
    {
      label: "Cash",
      value: Number(paymentSummary?.cash || 0),
      color: "#06b6d4",
    },
    {
      label: "Transfer",
      value: Number(paymentSummary?.transfer || 0),
      color: "#10b981",
    },
    {
      label: "Card",
      value: Number(paymentSummary?.card || 0),
      color: "#8b5cf6",
    },
  ];

  const paymentTotal = paymentChartData.reduce(
    (total, item) => total + item.value,
    0
  );

  let pieCursor = 0;

  const paymentPie =
    paymentTotal > 0
      ? paymentChartData
          .map((item) => {
            const start = pieCursor;
            const end = start + (item.value / paymentTotal) * 100;

            pieCursor = end;

            return `${item.color} ${start}% ${end}%`;
          })
          .join(", ")
      : "#e4e4e7 0% 100%";

  const maxProductSales = Math.max(
    ...topProducts.map((product) => Number(product.total_sales || 0)),
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
        Loading reports...
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
          Reports
        </h1>

        <p
          className="
            mt-2
            text-lg
            text-zinc-500
          "
        >
          Financial analytics
          and operational insights
        </p>
      </div>

      {/* DAILY SALES */}

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
            mb-6 flex
            items-center
            gap-3
          "
        >
          <div
            className="
              flex h-12 w-12
              items-center
              justify-center
              rounded-2xl
              bg-emerald-100
            "
          >
            <TrendingUp
              className="
                h-6 w-6
                text-emerald-700
              "
            />
          </div>

          <div>
            <h2
              className="
                text-2xl
                font-black
              "
            >
              Daily Sales
            </h2>

            <p
              className="
                text-zinc-500
              "
            >
              Today’s financial
              performance
            </p>
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          <div
            className="
              rounded-3xl
              bg-zinc-50
              p-5
            "
          >
            <p
              className="
                text-sm
                text-zinc-500
              "
            >
              Total Sales
            </p>

            <h3
              className="
                mt-3
                text-3xl
                font-black
              "
            >
              ₦
              {
                dailySales?.total_sales
              }
            </h3>
          </div>

          <div
            className="
              rounded-3xl
              bg-emerald-50
              p-5
            "
          >
            <p
              className="
                text-sm
                text-emerald-700
              "
            >
              Money Received
            </p>

            <h3
              className="
                mt-3
                text-3xl
                font-black
                text-emerald-700
              "
            >
              ₦
              {
                dailySales?.total_received_today
              }
            </h3>
          </div>

          <div
            className="
              rounded-3xl
              bg-red-50
              p-5
            "
          >
            <p
              className="
                text-sm
                text-red-700
              "
            >
              Outstanding Debt
            </p>

            <h3
              className="
                mt-3
                text-3xl
                font-black
                text-red-700
              "
            >
              ₦
              {
                dailySales?.total_balance
              }
            </h3>
          </div>

          <div
            className="
              rounded-3xl
              bg-blue-50
              p-5
            "
          >
            <p
              className="
                text-sm
                text-blue-700
              "
            >
              Transactions
            </p>

            <h3
              className="
                mt-3
                text-3xl
                font-black
                text-blue-700
              "
            >
              {
                dailySales?.transactions
              }
            </h3>
          </div>
        </div>
      </div>

      {/* PAYMENT SUMMARY */}

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
            mb-6 flex
            items-center
            gap-3
          "
        >
          <div
            className="
              flex h-12 w-12
              items-center
              justify-center
              rounded-2xl
              bg-violet-100
            "
          >
            <CreditCard
              className="
                h-6 w-6
                text-violet-700
              "
            />
          </div>

          <div>
            <h2
              className="
                text-2xl
                font-black
              "
            >
              Payment Summary
            </h2>

            <p
              className="
                text-zinc-500
              "
            >
              Payment method analytics
            </p>
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-3
          "
        >
          <div
            className="
              rounded-3xl
              bg-zinc-50
              p-5
            "
          >
            <p
              className="
                text-sm
                text-zinc-500
              "
            >
              Cash
            </p>

            <h3
              className="
                mt-3
                text-3xl
                font-black
              "
            >
              ₦
              {
                paymentSummary?.cash ||
                0
              }
            </h3>
          </div>

          <div
            className="
              rounded-3xl
              bg-zinc-50
              p-5
            "
          >
            <p
              className="
                text-sm
                text-zinc-500
              "
            >
              Transfer
            </p>

            <h3
              className="
                mt-3
                text-3xl
                font-black
              "
            >
              ₦
              {
                paymentSummary?.transfer ||
                0
              }
            </h3>
          </div>

          <div
            className="
              rounded-3xl
              bg-zinc-50
              p-5
            "
          >
            <p
              className="
                text-sm
                text-zinc-500
              "
            >
              Card
            </p>

            <h3
              className="
                mt-3
                text-3xl
                font-black
              "
            >
              ₦
              {
                paymentSummary?.card ||
                0
              }
            </h3>
          </div>
        </div>

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-[220px_1fr]
            lg:items-center
          "
        >
          <div className="flex justify-center">
            <div
              className="
                flex h-44 w-44
                items-center
                justify-center
                rounded-full
              "
              style={{
                background: `conic-gradient(${paymentPie})`,
              }}
              aria-label="Payment method pie chart"
            >
              <div
                className="
                  flex h-24 w-24
                  flex-col items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-center
                "
              >
                <span className="text-xs text-zinc-500">
                  Received
                </span>

                <span className="text-sm font-black">
                  {formatCurrency(paymentTotal)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {paymentChartData.map((item) => {
              const percentage =
                paymentTotal > 0
                  ? Math.round((item.value / paymentTotal) * 100)
                  : 0;

              return (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: item.color,
                        }}
                      />
                      <span className="font-bold">
                        {item.label}
                      </span>
                    </div>

                    <span className="text-zinc-500">
                      {formatCurrency(item.value)} · {percentage}%
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-zinc-100">
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DEBT SUMMARY */}

      <div
        className="
          rounded-[32px]
          border
          border-red-200
          bg-red-50
          p-6
        "
      >
        <div
          className="
            mb-6 flex
            items-center
            gap-3
          "
        >
          <div
            className="
              flex h-12 w-12
              items-center
              justify-center
              rounded-2xl
              bg-red-100
            "
          >
            <Wallet
              className="
                h-6 w-6
                text-red-700
              "
            />
          </div>

          <div>
            <h2
              className="
                text-2xl
                font-black
                text-red-700
              "
            >
              Debt Summary
            </h2>

            <p
              className="
                text-red-600
              "
            >
              Outstanding financial exposure
            </p>
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-3
          "
        >
          <div>
            <p
              className="
                text-sm
                text-red-600
              "
            >
              Partial Sales
            </p>

            <h3
              className="
                mt-2
                text-3xl
                font-black
                text-red-700
              "
            >
              {
                debtSummary?.partial_sales
              }
            </h3>
          </div>

          <div>
            <p
              className="
                text-sm
                text-red-600
              "
            >
              Unpaid Sales
            </p>

            <h3
              className="
                mt-2
                text-3xl
                font-black
                text-red-700
              "
            >
              {
                debtSummary?.unpaid_sales
              }
            </h3>
          </div>

          <div>
            <p
              className="
                text-sm
                text-red-600
              "
            >
              Total Outstanding
            </p>

            <h3
              className="
                mt-2
                text-3xl
                font-black
                text-red-700
              "
            >
              ₦
              {
                debtSummary?.total_outstanding
              }
            </h3>
          </div>
        </div>
      </div>

      {/* TOP PRODUCTS */}

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
            flex items-center
            gap-3
            border-b
            border-zinc-200
            p-6
          "
        >
          <div
            className="
              flex h-12 w-12
              items-center
              justify-center
              rounded-2xl
              bg-orange-100
            "
          >
            <BarChart3
              className="
                h-6 w-6
                text-orange-700
              "
            />
          </div>

          <div>
            <h2
              className="
                text-2xl
                font-black
              "
            >
              Top Products
            </h2>

            <p
              className="
                text-zinc-500
              "
            >
              Best-selling items
            </p>
          </div>
        </div>

        <div
          className="
            space-y-4
            border-b
            border-zinc-200
            p-6
          "
        >
          {topProducts.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No product sales data yet.
            </p>
          ) : (
            topProducts.slice(0, 5).map((product) => {
              const value = Number(product.total_sales || 0);
              const width = Math.max(
                (value / maxProductSales) * 100,
                6
              );

              return (
                <div key={product.product_name_snapshot}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="font-bold">
                      {product.product_name_snapshot}
                    </span>

                    <span className="text-zinc-500">
                      {formatCurrency(value)}
                    </span>
                  </div>

                  <div className="h-4 rounded-full bg-zinc-100">
                    <div
                      className="
                        h-4
                        rounded-full
                        bg-orange-500
                      "
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <table className="w-full">
          <thead
            className="
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
              <th className="px-6 py-4">
                Product
              </th>

              <th className="px-6 py-4">
                Qty Sold
              </th>

              <th className="px-6 py-4">
                Revenue
              </th>

              <th className="px-6 py-4">
                Transactions
              </th>
            </tr>
          </thead>

          <tbody>
            {topProducts.map(
              (product) => (
                <tr
                  key={
                    product.product_name_snapshot
                  }
                  className="
                    border-t
                    border-zinc-100
                  "
                >
                  <td
                    className="
                      px-6 py-5
                      font-bold
                    "
                  >
                    {
                      product.product_name_snapshot
                    }
                  </td>

                  <td className="px-6 py-5">
                    {
                      product.total_quantity
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
                      product.total_sales
                    }
                  </td>

                  <td className="px-6 py-5">
                    {
                      product.transaction_count
                    }
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
