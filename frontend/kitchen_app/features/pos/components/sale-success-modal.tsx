"use client";

import { CheckCircle2, Printer } from "lucide-react";

interface Props {
  open: boolean;

  onClose: () => void;

  onPrintReceipt: () => void;

  saleData: {
    receipt_number: string;

    payment_status: string;

    total_amount: number;

    amount_paid: number;

    balance: number;
  } | null;
}

export function SaleSuccessModal({
  open,
  onClose,
  onPrintReceipt,
  saleData,
}: Props) {
  if (!open || !saleData) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0
        z-50 flex
        items-center
        justify-center
        bg-black/40
        p-4
      "
    >
      <div
        className="
          w-full
          max-w-lg
          rounded-[32px]
          bg-white
          p-8
        "
      >
        {/* ICON */}

        <div
          className="
            mb-6 flex
            justify-center
          "
        >
          <div
            className="
              flex h-24 w-24
              items-center
              justify-center
              rounded-full
              bg-emerald-100
            "
          >
            <CheckCircle2
              className="
                h-14 w-14
                text-emerald-600
              "
            />
          </div>
        </div>

        {/* TITLE */}

        <div className="text-center">
          <h2
            className="
              text-4xl
              font-black
            "
          >
            Sale Completed
          </h2>

          <p
            className="
              mt-2
              text-zinc-500
            "
          >
            Transaction processed
            successfully
          </p>
        </div>

        {/* RECEIPT */}

        <div
          className="
            mt-8 rounded-3xl
            border
            border-zinc-200
            bg-zinc-50
            p-5
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <span
              className="
                text-zinc-500
              "
            >
              Receipt
            </span>

            <span
              className="
                font-black
              "
            >
              {
                saleData.receipt_number
              }
            </span>
          </div>

          <div
            className="
              mt-4 flex
              items-center
              justify-between
            "
          >
            <span
              className="
                text-zinc-500
              "
            >
              Total
            </span>

            <span
              className="
                text-xl
                font-black
              "
            >
              ₦
              {
                saleData.total_amount
              }
            </span>
          </div>

          <div
            className="
              mt-4 flex
              items-center
              justify-between
            "
          >
            <span
              className="
                text-zinc-500
              "
            >
              Paid
            </span>

            <span
              className="
                text-xl
                font-black
                text-emerald-600
              "
            >
              ₦
              {
                saleData.amount_paid
              }
            </span>
          </div>

          <div
            className="
              mt-4 flex
              items-center
              justify-between
            "
          >
            <span
              className="
                text-zinc-500
              "
            >
              Balance
            </span>

            <span
              className={`
                text-xl
                font-black

                ${
                  saleData.balance >
                  0
                    ? "text-red-500"

                    : "text-zinc-900"
                }
              `}
            >
              ₦
              {
                saleData.balance
              }
            </span>
          </div>

          <div
            className="
              mt-5 flex
              justify-center
            "
          >
            <span
              className={`
                rounded-full
                px-4 py-2
                text-sm
                font-bold

                ${
                  saleData.payment_status ===
                  "PAID"
                    ? "bg-emerald-100 text-emerald-700"

                    : saleData.payment_status ===
                      "PARTIAL"
                    ? "bg-yellow-100 text-yellow-700"

                    : "bg-red-100 text-red-700"
                }
              `}
            >
              {
                saleData.payment_status
              }
            </span>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="
              h-14
              w-full
              rounded-3xl
              border
              border-zinc-300
              text-lg
              font-bold
            "
          >
            Done
          </button>

          <button
            onClick={onPrintReceipt}
            className="
              h-14
              w-full
              rounded-3xl
              bg-black
              text-lg
              font-bold
              text-white
            "
          >
            <Printer className="inline-block mr-2 h-5 w-5" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
