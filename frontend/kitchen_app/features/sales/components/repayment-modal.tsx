"use client";

import { useState } from "react";

import { X } from "lucide-react";

import { toast } from "sonner";

import { repaySale } from "../services/sales.service";

import { Sale } from "../types/sales.types";

interface Props {
  open: boolean;

  onClose: () => void;

  sale: Sale | null;

  onSuccess: () => void;
}

const MAX_REPAYMENTS = 5;

const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export function RepaymentModal({ open, onClose, sale, onSuccess }: Props) {
  const [amount, setAmount] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const [reference, setReference] = useState("");

  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);

  if (!open || !sale) {
    return null;
  }

  const activeSale = sale;

  const balance = Number(activeSale.balance);

  const paidSoFar = Number(activeSale.amount_paid ?? activeSale.paid_amount ?? 0);

  const payments = [...(activeSale.payments || [])].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const repaymentCount =
    activeSale.repayment_count ??
    payments.filter((payment) => payment.payment_type === "REPAYMENT").length;

  const remainingSlots =
    activeSale.remaining_repayment_slots ??
    Math.max(MAX_REPAYMENTS - repaymentCount, 0);

  const canRepay = balance > 0 && remainingSlots > 0;

  async function handleRepayment() {
    const repaymentAmount = Number(amount);

    if (!canRepay) {
      toast.error("No repayment slot available");

      return;
    }

    if (repaymentAmount <= 0) {
      toast.error("Enter valid amount");

      return;
    }

    if (repaymentAmount > balance) {
      toast.error("Repayment exceeds balance");

      return;
    }

    try {
      setLoading(true);

      await repaySale({
        sale_id: activeSale.id,
        payment_method: paymentMethod,
        amount: repaymentAmount,
        reference,
        note,
      });

      toast.success("Repayment recorded");

      onSuccess();

      onClose();

      setAmount("");
      setReference("");
      setNote("");
    } catch (error) {
      console.error(error);

      toast.error("Repayment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">Flexible Payment</h2>

            <p className="mt-1 text-zinc-500">{activeSale.receipt_number}</p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100"
            aria-label="Close repayment window"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-red-50 p-4">
            <p className="text-sm font-bold text-red-500">Outstanding</p>
            <h3 className="mt-2 text-3xl font-black text-red-600">
              {formatCurrency(balance)}
            </h3>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-sm font-bold text-emerald-600">Paid so far</p>
            <h3 className="mt-2 text-3xl font-black text-emerald-700">
              {formatCurrency(paidSoFar)}
            </h3>
          </div>

          <div className="rounded-2xl bg-zinc-100 p-4">
            <p className="text-sm font-bold text-zinc-600">Repayment plan</p>
            <h3 className="mt-2 text-3xl font-black">
              {repaymentCount}/{MAX_REPAYMENTS}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              {remainingSlots} slot(s) remaining
            </p>
          </div>
        </div>

        {!canRepay && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            This sale has used all 5 repayment slots. Review the payment history
            before adding another arrangement.
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold">
                Amount customer is paying now
              </label>

              <input
                type="number"
                min="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                disabled={!canRepay}
                className="h-14 w-full rounded-2xl border border-zinc-300 px-4 text-lg outline-none disabled:bg-zinc-100"
              />

              <button
                type="button"
                onClick={() => setAmount(String(balance))}
                disabled={!canRepay}
                className="mt-2 text-sm font-bold text-cyan-600 disabled:text-zinc-400"
              >
                Pay full outstanding balance
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">Payment Method</label>

              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                disabled={!canRepay}
                className="h-14 w-full rounded-2xl border border-zinc-300 px-4 outline-none disabled:bg-zinc-100"
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card/POS</option>
                <option value="TRANSFER">Transfer</option>
                <option value="MIXED">Mixed</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Reference or transaction ID
              </label>

              <input
                type="text"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                disabled={!canRepay}
                className="h-14 w-full rounded-2xl border border-zinc-300 px-4 outline-none disabled:bg-zinc-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">Payment note</label>

              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                disabled={!canRepay}
                rows={3}
                className="w-full resize-none rounded-2xl border border-zinc-300 px-4 py-3 outline-none disabled:bg-zinc-100"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black">Payment Timeline</h3>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
                {payments.length} record(s)
              </span>
            </div>

            {payments.length === 0 ? (
              <p className="text-sm text-zinc-500">No payment has been recorded.</p>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id ?? `${payment.created_at}-${payment.amount}`}
                    className="rounded-2xl bg-zinc-50 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-xs font-bold uppercase text-zinc-500">
                          {payment.payment_type === "REPAYMENT"
                            ? `Repayment ${payment.sequence_number || ""}`
                            : "Initial payment"}
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold">
                        {payment.payment_method}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-zinc-500">
                      {new Date(payment.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="h-14 flex-1 rounded-2xl border border-zinc-300 font-bold"
          >
            Cancel
          </button>

          <button
            onClick={handleRepayment}
            disabled={loading || !canRepay}
            className="h-14 flex-1 rounded-2xl bg-black font-bold text-white disabled:opacity-50"
          >
            {loading ? "Processing..." : "Record Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
