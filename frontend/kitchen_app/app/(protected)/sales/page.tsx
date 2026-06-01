"use client";

import { useState } from "react";

import {
  Search,
  Receipt,
  X,
} from "lucide-react";

import { useSales }
from "@/features/sales/hooks/use-sales";

import { getSaleDetail }
from "@/features/sales/services/sale-detail.service";

import { RepaymentModal }
from "@/features/sales/components/repayment-modal";

import { ReceiptModal }
from "@/features/sales/components/receipt-modal";

import { Sale }
from "@/features/sales/types/sales.types";

export default function SalesPage() {

  const [page, setPage] =
    useState(1);

  const [
    repaymentOpen,
    setRepaymentOpen,
  ] = useState(false);

  const [
    receiptOpen,
    setReceiptOpen,
  ] = useState(false);

  const [
    detailOpen,
    setDetailOpen,
  ] = useState(false);

  const [
    selectedSale,
    setSelectedSale,
  ] =
    useState<Sale | null>(
      null
    );

  const [
    receiptData,
    setReceiptData,
  ] = useState<any>(null);

  const {
    sales,
    count,
    loading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    refresh,
  } = useSales(page);

  async function openSaleDetail(
    sale: Sale
  ) {

    try {

      const response =
        await getSaleDetail(
          sale.id
        );

      setSelectedSale(
        sale
      );

      setReceiptData(
        response
      );

      setDetailOpen(
        true
      );

    } catch (error) {

      console.error(
        error
      );
    }
  }

  return (
    <>
      <div
        className="
          min-w-0
          space-y-6
        "
      >

        {/* HEADER */}

        <div
          className="
            flex flex-col
            gap-5
            xl:flex-row
            xl:items-center
            xl:justify-between
          "
        >
          <div>
            <h1
              className="
                text-5xl
                font-black
                tracking-tight
              "
            >
              Sales
            </h1>

            <p
              className="
                mt-2
                text-lg
                text-zinc-500
              "
            >
              Track transactions
              and repayments
            </p>
          </div>

          <div
            className="
              flex flex-col
              gap-3
              md:flex-row
            "
          >

            {/* SEARCH */}

            <div className="relative">

              <Search
                className="
                  absolute left-4 top-1/2
                  h-5 w-5
                  -translate-y-1/2
                  text-zinc-400
                "
              />

              <input
                type="text"
                placeholder="Search receipts..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="
                  h-14 w-full
                  rounded-2xl
                  border
                  border-zinc-300
                  bg-white
                  pl-12 pr-4
                  outline-none
                  md:w-[320px]
                "
              />
            </div>

            {/* FILTER */}

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
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
                All Status
              </option>

              <option value="PAID">
                Paid
              </option>

              <option value="PARTIAL">
                Partial
              </option>

              <option value="UNPAID">
                Unpaid
              </option>
            </select>
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

                <th className="px-6 py-5">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan={8}
                    className="
                      py-20
                      text-center
                      text-zinc-500
                    "
                  >
                    Loading sales...
                  </td>
                </tr>

              ) : error ? (

                <tr>
                  <td
                    colSpan={8}
                    className="
                      py-20
                      text-center
                      text-red-500
                    "
                  >
                    {error}
                  </td>
                </tr>

              ) : sales.length === 0 ? (

                <tr>
                  <td
                    colSpan={8}
                    className="
                      py-20
                      text-center
                      text-zinc-500
                    "
                  >
                    No sales found
                  </td>
                </tr>

              ) : (

                sales.map((sale) => (

                  <tr
                    key={sale.id}
                    onClick={() =>
                      openSaleDetail(
                        sale
                      )
                    }
                    className="
                      cursor-pointer
                      border-b
                      border-zinc-100
                      transition
                      hover:bg-zinc-50
                    "
                  >

                    {/* RECEIPT */}

                    <td className="px-6 py-5">

                      <div
                        className="
                          flex items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex h-11 w-11
                            items-center
                            justify-center
                            rounded-2xl
                            bg-zinc-100
                          "
                        >
                          <Receipt
                            className="
                              h-5 w-5
                              text-zinc-500
                            "
                          />
                        </div>

                        <div>

                          <p
                            className="
                              font-bold
                            "
                          >
                            {
                              sale.receipt_number
                            }
                          </p>

                          <p
                            className="
                              text-sm
                              text-zinc-500
                            "
                          >
                            Sale #
                            {sale.id}
                          </p>

                        </div>
                      </div>
                    </td>

                    {/* CUSTOMER */}

                    <td className="px-6 py-5">
                      {sale.customer_name ||
                        "Walk-in Customer"}
                    </td>

                    {/* TOTAL */}

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

                    {/* PAID */}

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

                    {/* BALANCE */}

                    <td
                      className={`
                        px-6 py-5
                        font-bold

                        ${
                          Number(
                            sale.balance
                          ) > 0
                            ? "text-red-500"
                            : "text-zinc-900"
                        }
                      `}
                    >
                      ₦
                      {
                        sale.balance
                      }
                    </td>

                    {/* STATUS */}

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

                    {/* DATE */}

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

                    {/* ACTIONS */}

                    <td className="px-6 py-5">

                      <div className="flex gap-2">

                        <button
                          onClick={async (e) => {

                            e.stopPropagation();

                            const response =
                              await getSaleDetail(
                                sale.id
                              );

                            setReceiptData(
                              response
                            );

                            setReceiptOpen(
                              true
                            );
                          }}
                          className="
                            rounded-xl
                            border
                            border-zinc-300
                            px-4 py-2
                            text-xs
                            font-bold
                          "
                        >
                          Receipt
                        </button>

                        {Number(
                          sale.balance
                        ) > 0 && (

                          <button
                            onClick={(e) => {

                              e.stopPropagation();

                              setSelectedSale(
                                sale
                              );

                              setRepaymentOpen(
                                true
                              );
                            }}
                            className="
                              rounded-xl
                              bg-black
                              px-4 py-2
                              text-xs
                              font-bold
                              text-white
                            "
                          >
                            Repay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}

        <div
          className="
            flex items-center
            justify-between
          "
        >

          <p
            className="
              text-zinc-500
            "
          >
            Total Sales:
            {" "}
            {count}
          </p>

          <div className="flex gap-3">

            <button
              onClick={() =>
                setPage((prev) =>
                  Math.max(
                    prev - 1,
                    1
                  )
                )
              }
              disabled={page === 1}
              className="
                rounded-2xl
                border
                border-zinc-300
                bg-white
                px-5 py-3
                font-medium
                disabled:opacity-40
              "
            >
              Previous
            </button>

            <button
              onClick={() =>
                setPage(
                  (prev) =>
                    prev + 1
                )
              }
              disabled={
                sales.length === 0
              }
              className="
                rounded-2xl
                border
                border-zinc-300
                bg-white
                px-5 py-3
                font-medium
                disabled:opacity-40
              "
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL DRAWER */}

      <div
        className={`
          fixed right-0 top-0
          z-[120]
          h-full
          w-full
          max-w-xl
          border-l
          border-zinc-200
          bg-white
          shadow-2xl
          transition-transform
          duration-300

          ${
            detailOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >

        {/* HEADER */}

        <div
          className="
            flex items-center
            justify-between
            border-b
            border-zinc-200
            p-6
          "
        >

          <div>

            <h2
              className="
                text-3xl
                font-black
              "
            >
              Sale Detail
            </h2>

            <p
              className="
                mt-1
                text-zinc-500
              "
            >
              Transaction breakdown
            </p>
          </div>

          <button
            onClick={() =>
              setDetailOpen(
                false
              )
            }
            className="
              rounded-2xl
              border
              border-zinc-300
              p-3
            "
          >
            <X
              className="
                h-5 w-5
              "
            />
          </button>
        </div>

        {/* CONTENT */}

        <div
          className="
            h-[calc(100vh-100px)]
            overflow-y-auto
            p-6
          "
        >

          {receiptData && (

            <div className="space-y-6">

              <div>

                <p className="text-sm text-zinc-500">
                  Receipt
                </p>

                <h3
                  className="
                    mt-1
                    text-2xl
                    font-black
                  "
                >
                  {
                    receiptData.receipt_number
                  }
                </h3>
              </div>

              <div
                className="
                  grid grid-cols-2
                  gap-4
                "
              >

                <div
                  className="
                    rounded-2xl
                    bg-zinc-100
                    p-4
                  "
                >
                  <p className="text-sm text-zinc-500">
                    Total
                  </p>

                  <h3
                    className="
                      mt-2
                      text-2xl
                      font-black
                    "
                  >
                    ₦
                    {
                      receiptData.total_amount
                    }
                  </h3>
                </div>

                <div
                  className="
                    rounded-2xl
                    bg-zinc-100
                    p-4
                  "
                >
                  <p className="text-sm text-zinc-500">
                    Balance
                  </p>

                  <h3
                    className="
                      mt-2
                      text-2xl
                      font-black
                      text-red-500
                    "
                  >
                    ₦
                    {
                      receiptData.balance
                    }
                  </h3>
                </div>
              </div>

              {/* ITEMS */}

              <div>

                <h3
                  className="
                    mb-4
                    text-xl
                    font-black
                  "
                >
                  Items
                </h3>

                <div className="space-y-3">

                  {receiptData.items?.map(
                    (
                      item: any,
                      index: number
                    ) => (

                      <div
                        key={index}
                        className="
                          flex
                          items-center
                          justify-between
                          rounded-2xl
                          border
                          border-zinc-200
                          p-4
                        "
                      >

                        <div>
                          <p className="font-bold">
                            {
                              item.product_name
                            }
                          </p>

                          <p
                            className="
                              text-sm
                              text-zinc-500
                            "
                          >
                            Qty:
                            {" "}
                            {
                              item.quantity
                            }
                          </p>
                        </div>

                        <p className="font-black">
                          ₦
                          {
                            item.subtotal
                          }
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REPAYMENT MODAL */}

      <RepaymentModal
        open={repaymentOpen}
        onClose={() =>
          setRepaymentOpen(
            false
          )
        }
        sale={selectedSale}
        onSuccess={refresh}
      />

      {/* RECEIPT MODAL */}

      <ReceiptModal
        open={receiptOpen}
        onClose={() =>
          setReceiptOpen(
            false
          )
        }
        receipt={receiptData}
      />
    </>
  );
}
