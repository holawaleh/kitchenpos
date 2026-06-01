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

const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

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
                placeholder="Search customer name, phone, or receipt..."
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

        {/* MOBILE CARDS */}

        <div className="space-y-3 xl:hidden">
          {loading ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center text-zinc-500">
              Loading sales...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
              {error}
            </div>
          ) : sales.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center text-zinc-500">
              No sales found
            </div>
          ) : (
            sales.map((sale) => (
              <div
                key={sale.id}
                onClick={() => openSaleDetail(sale)}
                role="button"
                tabIndex={0}
                className="w-full rounded-2xl border border-zinc-200 bg-white p-4 text-left active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{sale.receipt_number}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {sale.customer_name || "Walk-in Customer"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      sale.payment_status === "PAID"
                        ? "bg-emerald-100 text-emerald-700"
                        : sale.payment_status === "PARTIAL"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {sale.payment_status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-xl bg-zinc-50 p-3">
                    <p className="text-zinc-500">Total</p>
                    <p className="mt-1 font-bold">
                      {formatCurrency(sale.total_amount)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="text-zinc-500">Paid</p>
                    <p className="mt-1 font-bold text-emerald-700">
                      {formatCurrency(sale.amount_paid)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-red-50 p-3">
                    <p className="text-zinc-500">Balance</p>
                    <p className="mt-1 font-bold text-red-600">
                      {formatCurrency(sale.balance)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={async (event) => {
                      event.stopPropagation();

                      const response = await getSaleDetail(sale.id);

                      setReceiptData(response);
                      setReceiptOpen(true);
                    }}
                    className="h-11 flex-1 rounded-xl border border-zinc-300 text-sm font-bold"
                  >
                    Receipt
                  </button>

                  {Number(sale.balance) > 0 && (
                    <button
                      onClick={async (event) => {
                        event.stopPropagation();

                        const response = await getSaleDetail(sale.id);

                        setSelectedSale(response);
                        setRepaymentOpen(true);
                      }}
                      className="h-11 flex-1 rounded-xl bg-black text-sm font-bold text-white"
                    >
                      Flexible Pay {sale.repayment_count ?? 0}/5
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* TABLE */}

        <div
          className="
            hidden
            overflow-x-auto
            rounded-[32px]
            border
            border-zinc-200
            bg-white
            xl:block
          "
        >
          <table className="min-w-[1320px] w-full">

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
                  Repayments
                </th>

                <th className="px-6 py-5">
                  Date
                </th>

                <th className="sticky right-0 z-10 min-w-[270px] border-l border-zinc-100 bg-zinc-50 px-6 py-5">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan={9}
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
                    colSpan={9}
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
                    colSpan={9}
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

                    {/* REPAYMENTS */}

                    <td
                      className="
                        px-6 py-5
                        text-sm
                        font-bold
                        text-zinc-600
                      "
                    >
                      {sale.repayment_count ?? 0}
                      /5
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

                    <td className="sticky right-0 z-10 min-w-[270px] border-l border-zinc-100 bg-white px-6 py-5">

                      <div className="flex flex-wrap justify-end gap-2">

                        <button
                          onClick={async (e) => {

                            e.stopPropagation();

                            await openSaleDetail(
                              sale
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
                          Preview
                        </button>

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
                            onClick={async (e) => {

                              e.stopPropagation();

                              const response =
                                await getSaleDetail(
                                  sale.id
                                );

                              setSelectedSale(
                                response
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
                            Flexible Pay
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

              {receiptData.customer_payment_summary && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-cyan-200
                    bg-cyan-50
                    p-4
                  "
                >
                  <div className="mb-4">
                    <p className="text-sm font-bold text-cyan-700">
                      Customer Transaction Summary
                    </p>

                    <h3 className="mt-1 text-xl font-black">
                      {
                        receiptData.customer_payment_summary.customer_name
                      }
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-cyan-700">
                        Sales count
                      </p>

                      <p className="font-black">
                        {
                          receiptData.customer_payment_summary.sale_count
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-cyan-700">
                        Total purchases
                      </p>

                      <p className="font-black">
                        {formatCurrency(
                          receiptData.customer_payment_summary.total_amount
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-cyan-700">
                        Total paid
                      </p>

                      <p className="font-black text-emerald-700">
                        {formatCurrency(
                          receiptData.customer_payment_summary.paid_amount
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-cyan-700">
                        Outstanding
                      </p>

                      <p className="font-black text-red-600">
                        {formatCurrency(
                          receiptData.customer_payment_summary.outstanding_balance
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
