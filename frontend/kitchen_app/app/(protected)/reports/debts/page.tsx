"use client";

import { useEffect, useMemo, useState }
from "react";

import {
  Wallet,
  AlertCircle,
} from "lucide-react";

import apiClient
from "@/lib/api-client";

interface Sale {
  id: number;

  receipt_number: string;

  customer_name: string;

  total_amount: string;

  amount_paid: string;

  balance: string;

  payment_status:
    | "PAID"
    | "PARTIAL"
    | "UNPAID";

  created_at: string;
}

export default function DebtPage() {

  const [sales, setSales] =
    useState<Sale[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadDebts() {

    try {

      const response =
        await apiClient.get(
          "/sales/"
        );

      const filtered =
        (
          response.data.results || []
        ).filter(
          (sale: Sale) =>
            Number(
              sale.balance
            ) > 0
        );

      setSales(filtered);

    } catch (error) {

      console.error(error);

      setError(
        "Failed to load debt analytics"
      );

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    loadDebts();

  }, []);

  const totalDebt =
    useMemo(() => {

      return sales.reduce(
        (sum, sale) =>
          sum +
          Number(
            sale.balance
          ),
        0
      );

    }, [sales]);

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
        Loading debt analytics...
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
          flex items-center
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
            bg-red-100
          "
        >
          <Wallet
            className="
              h-8 w-8
              text-red-700
            "
          />
        </div>

        <div>

          <h1
            className="
              text-5xl
              font-black
              tracking-tight
            "
          >
            Debt Analytics
          </h1>

          <p
            className="
              mt-2
              text-lg
              text-zinc-500
            "
          >
            Outstanding balances
            and repayment monitoring
          </p>
        </div>
      </div>

      {/* SUMMARY */}

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
            flex items-center
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
                text-5xl
                font-black
                text-red-700
              "
            >
              ₦
              {totalDebt}
            </h2>
          </div>

          <div
            className="
              flex h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              bg-red-100
            "
          >
            <AlertCircle
              className="
                h-10 w-10
                text-red-700
              "
            />
          </div>
        </div>
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
                Receipt
              </th>

              <th className="px-6 py-5">
                Customer
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

                  <td className="px-6 py-5">
                    {
                      sale.customer_name ||
                      "Walk-in"
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
                      sale.amount_paid
                    }
                  </td>

                  <td
                    className="
                      px-6 py-5
                      font-bold
                      text-red-600
                    "
                  >
                    ₦
                    {
                      sale.balance
                    }
                  </td>

                  <td className="px-6 py-5">

                    <span
                      className="
                        rounded-full
                        bg-red-100
                        px-3 py-1
                        text-xs
                        font-bold
                        text-red-700
                      "
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
  );
}