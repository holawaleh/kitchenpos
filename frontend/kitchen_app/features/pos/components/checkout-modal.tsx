"use client";

import { useState } from "react";

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
    rounded-[32px]
    bg-white
    p-6
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
                text-6xl
                font-black
              "
            >
              Checkout
            </h1>

            <p
              className="
                mt-2
                text-2xl
                text-zinc-500
              "
            >
              Complete customer payment
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-zinc-100
              text-3xl
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
              text-xl
              font-bold
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
              h-16
              w-full
              rounded-2xl
              border
              border-zinc-300
              px-5
              text-xl
              outline-none
            "
          />
        </div>

        {/* METHOD */}

        <div className="mb-6">
          <label
            className="
              mb-3 block
              text-xl
              font-bold
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
              h-16
              w-full
              rounded-2xl
              border
              border-zinc-300
              px-5
              text-xl
              outline-none
            "
          >
            <option value="CASH">
              Cash
            </option>

            <option value="TRANSFER">
              Transfer
            </option>

            <option value="POS">
              POS
            </option>
          </select>
        </div>

        {/* AMOUNT */}

        <div className="mb-8">
          <label
            className="
              mb-3 block
              text-xl
              font-bold
            "
          >
            Amount Paid
          </label>

          <input
            type="number"
            value={amountPaid}
            onChange={(e) =>
              setAmountPaid(
                e.target.value
              )
            }
            className="
              h-16
              w-full
              rounded-2xl
              border
              border-zinc-300
              px-5
              text-xl
              outline-none
            "
          />
        </div>

        {/* SUMMARY */}

        <div
          className="
            mb-8
            rounded-3xl
            bg-zinc-100
            p-6
          "
        >
          <div
            className="
              mb-4 flex
              items-center
              justify-between
            "
          >
            <span className="text-2xl">
              Total
            </span>

            <span
              className="
                text-5xl
                font-black
              "
            >
              ₦{total}
            </span>
          </div>

          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <span className="text-2xl">
              Remaining
            </span>

            <span
              className="
                text-5xl
                font-black
                text-red-500
              "
            >
              ₦{remaining}
            </span>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="
              h-16
              flex-1
              rounded-3xl
              border
              border-zinc-300
              text-xl
              font-bold
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
              rounded-3xl
              bg-black
              text-xl
              font-bold
              text-white
            "
          >
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
}