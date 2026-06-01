"use client";

import { useState } from "react";

import { X } from "lucide-react";

import { toast } from "sonner";

import { repaySale }
from "../services/sales.service";

import { Sale }
from "../types/sales.types";

interface Props {
  open: boolean;

  onClose: () => void;

  sale: Sale | null;

  onSuccess: () => void;
}

export function RepaymentModal({
  open,
  onClose,
  sale,
  onSuccess,
}: Props) {
  const [amount, setAmount] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("CASH");

  const [loading, setLoading] =
    useState(false);

  if (!open || !sale) {
    return null;
  }

  const balance =
    Number(sale!.balance);

  async function handleRepayment() {
    const repaymentAmount =
      Number(amount);

    if (
      repaymentAmount <= 0
    ) {
      toast.error(
        "Enter valid amount"
      );

      return;
    }

    if (
      repaymentAmount >
      balance
    ) {
      toast.error(
        "Repayment exceeds balance"
      );

      return;
    }

    try {
      setLoading(true);

      await repaySale({
        sale_id: sale!.id,

        payment_method:
          paymentMethod,

        amount:
          repaymentAmount,
      });

      toast.success(
        "Repayment successful"
      );

      onSuccess();

      onClose();

      setAmount("");
    } catch (error) {
      console.error(error);

      toast.error(
        "Repayment failed"
      );
    } finally {
      setLoading(false);
    }
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
          p-6
        "
      >
        {/* HEADER */}

        <div
          className="
            mb-6 flex
            items-center
            justify-between
          "
        >
          <div>
            <h2
              className="
                text-3xl
                font-black
              "
            >
              Repayment
            </h2>

            <p
              className="
                mt-1
                text-zinc-500
              "
            >
              {
                sale!.receipt_number
              }
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              flex h-10 w-10
              items-center
              justify-center
              rounded-xl
              bg-zinc-100
            "
          >
            <X />
          </button>
        </div>

        {/* BALANCE */}

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
              font-bold
              text-red-500
            "
          >
            Outstanding Balance
          </p>

          <h3
            className="
              mt-2
              text-4xl
              font-black
              text-red-600
            "
          >
            ₦{sale!.balance}
          </h3>
        </div>

        {/* FORM */}

        <div className="mt-6 space-y-5">
          <div>
            <label
              className="
                mb-2 block
                text-sm
                font-bold
              "
            >
              Amount Paying
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              placeholder="0.00"
              className="
                h-14 w-full
                rounded-2xl
                border
                border-zinc-300
                px-4
                text-lg
                outline-none
              "
            />
          </div>

          <div>
            <label
              className="
                mb-2 block
                text-sm
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
                h-14 w-full
                rounded-2xl
                border
                border-zinc-300
                px-4
                outline-none
              "
            >
              <option value="CASH">
                Cash
              </option>

              <option value="CARD">
                Card
              </option>

              <option value="TRANSFER">
                Transfer
              </option>
            </select>
          </div>
        </div>

        {/* ACTIONS */}

        <div
          className="
            mt-6 flex
            gap-3
          "
        >
          <button
            onClick={onClose}
            className="
              h-14 flex-1
              rounded-2xl
              border
              border-zinc-300
              font-bold
            "
          >
            Cancel
          </button>

          <button
            onClick={
              handleRepayment
            }
            disabled={loading}
            className="
              h-14 flex-1
              rounded-2xl
              bg-black
              font-bold
              text-white
              disabled:opacity-50
            "
          >
            {loading
              ? "Processing..."
              : "Complete Repayment"}
          </button>
        </div>
      </div>
    </div>
  );
}