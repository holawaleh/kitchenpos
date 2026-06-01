"use client";

import { useState } from "react";

const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

interface Props {
  open: boolean;

  onClose: () => void;

  total: number;

  onSubmit: (data: {
    customer_name: string;
    payment_method: string;
    amount_paid: number;
  }) => void;
}

export default function CheckoutModal({
  open,
  onClose,
  total,
  onSubmit,
}: Props) {
  const [
    customerName,
    setCustomerName,
  ] = useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("CASH");

  const [
    amountPaid,
    setAmountPaid,
  ] = useState("");

  if (!open) {
    return null;
  }

  const paid =
    Number(amountPaid) || 0;

  const remaining =
    total - paid;

  return (
    <div
      className="
        fixed inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
    >
      <div
  className="
    w-full
    max-w-2xl
    max-h-[90vh]
    overflow-y-auto
    rounded-[24px]
    bg-white
    p-4
    sm:rounded-[32px]
    sm:p-6
  "
>
        {/* HEADER */}

        <div
          className="
            mb-8 flex
            items-start
            justify-between
          "
        >
          <div>
            <h1
              className="
                text-3xl
                font-black
                sm:text-6xl
              "
            >
              Checkout
            </h1>

            <p
              className="
                mt-2
                text-base
                text-zinc-500
                sm:text-2xl
              "
            >
              Complete customer payment
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-zinc-100
              text-2xl
              font-black
            "
          >
            ×
          </button>
        </div>

        {/* CUSTOMER */}

        <div className="mb-6">
          <label
            className="
              mb-3 block
              text-base
              font-bold
              sm:text-xl
            "
          >
            Customer Name
          </label>

          <input
            type="text"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            className="
              h-14
              w-full
              rounded-2xl
              border
              border-zinc-300
              px-5
              text-base
              sm:h-16
              sm:text-xl
              outline-none
            "
          />
        </div>

        {/* METHOD */}

        <div className="mb-6">
          <label
            className="
              mb-3 block
              text-base
              font-bold
              sm:text-xl
            "
          >
            Payment Method
          </label>

          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }
            className="
              h-14
              w-full
              rounded-2xl
              border
              border-zinc-300
              px-5
              text-base
              sm:h-16
              sm:text-xl
              outline-none
            "
          >
            <option value="CASH">
              Cash
            </option>

            <option value="TRANSFER">
              Transfer
            </option>

            <option value="CARD">
              Card/POS
            </option>

            <option value="MIXED">
              Mixed
            </option>
          </select>
        </div>

        {/* AMOUNT */}

        <div className="mb-8">
          <label
            className="
              mb-3 block
              text-base
              font-bold
              sm:text-xl
            "
          >
            Amount Paid
          </label>

          <p
            className="
              mb-3
              text-sm
              font-semibold
              text-zinc-500
            "
          >
            Enter any amount the customer is paying now. The balance stays pending.
          </p>

          <input
            type="number"
            value={amountPaid}
            onChange={(e) =>
              setAmountPaid(
                e.target.value
              )
            }
            className="
              h-14
              w-full
              rounded-2xl
              border
              border-zinc-300
              px-5
              text-base
              sm:h-16
              sm:text-xl
              outline-none
            "
          />

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                setAmountPaid("0")
              }
              className="
                rounded-xl
                bg-zinc-100
                px-4 py-2
                text-sm
                font-bold
              "
            >
              Pay later
            </button>

            <button
              type="button"
              onClick={() =>
                setAmountPaid(String(total))
              }
              className="
                rounded-xl
                bg-zinc-100
                px-4 py-2
                text-sm
                font-bold
              "
            >
              Full payment
            </button>
          </div>
        </div>

        {/* SUMMARY */}

        <div
          className="
            mb-8
            rounded-3xl
            bg-zinc-100
            p-4
            sm:p-6
          "
        >
          <div
            className="
              mb-4 flex
              items-center
              justify-between
            "
          >
            <span className="text-base sm:text-2xl">
              Total
            </span>

            <span
              className="
                text-3xl
                font-black
                sm:text-5xl
              "
            >
              {formatCurrency(total)}
            </span>
          </div>

          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <span className="text-base sm:text-2xl">
              Remaining
            </span>

            <span
              className="
                text-3xl
                font-black
                text-red-500
                sm:text-5xl
              "
            >
              {formatCurrency(remaining)}
            </span>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="
              h-16
              flex-1
              rounded-2xl
              border
              border-zinc-300
              text-base
              font-bold
              sm:text-xl
            "
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSubmit({
                customer_name:
                  customerName,

                payment_method:
                  paymentMethod,

                amount_paid:
                  Number(
                    amountPaid
                  ),
              })
            }
            className="
              h-16
              flex-1
              rounded-2xl
              bg-black
              text-base
              font-bold
              text-white
              sm:text-xl
            "
          >
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
}
