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

export default function ReportsPage() {
  const {
    dailySales,
    debtSummary,
    paymentSummary,
    topProducts,
    loading,
    error,
  } = useReports();

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
