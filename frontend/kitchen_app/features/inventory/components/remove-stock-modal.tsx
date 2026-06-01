"use client";

import { useState } from "react";

import { toast } from "sonner";

import {
  deductStock,
} from "../services/inventory.service";

import {
  InventoryItem,
} from "../types/inventory.types";

interface Props {
  open: boolean;

  onClose: () => void;

  onSuccess: () => void;

  item: InventoryItem;
}

export function RemoveStockModal({
  open,
  onClose,
  onSuccess,
  item,
}: Props) {
  const [quantity, setQuantity] =
    useState("");

  const [note, setNote] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  if (!open) return null;

  async function handleRemoveStock() {
    if (!quantity) {
      toast.error(
        "Quantity is required"
      );

      return;
    }

    try {
      setLoading(true);

      await deductStock({
        product_id:
          item.product.id,

        quantity:
          Number(quantity),

        note,
      });

      toast.success(
        "Stock deducted successfully"
      );

      setQuantity("");

      setNote("");

      await onSuccess();

      onClose();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to deduct stock"
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
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full max-w-md
          rounded-3xl
          bg-white p-6
          shadow-2xl
        "
      >
        <div className="mb-5">
          <h2
            className="
              text-3xl
              font-bold
            "
          >
            Remove Stock
          </h2>

          <p
            className="
              mt-1 text-sm
              text-zinc-500
            "
          >
            {
              item.product.name
            }
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                e.target.value
              )
            }
            className="
              h-12 w-full
              rounded-2xl
              border
              border-zinc-300
              px-4
              text-sm
              outline-none
              focus:border-red-500
            "
          />

          <textarea
            placeholder="Reason / Note"
            value={note}
            onChange={(e) =>
              setNote(
                e.target.value
              )
            }
            className="
              min-h-28
              w-full rounded-2xl
              border
              border-zinc-300
              p-4
              text-sm
              outline-none
              focus:border-red-500
            "
          />
        </div>

        <div
          className="
            mt-6 flex
            justify-end
            gap-3
          "
        >
          <button
            onClick={onClose}
            className="
              rounded-2xl
              border
              border-zinc-300
              px-5 py-3
              text-sm
            "
          >
            Cancel
          </button>

          <button
            onClick={
              handleRemoveStock
            }
            disabled={loading}
            className="
              rounded-2xl
              bg-red-600
              px-5 py-3
              text-sm
              font-semibold
              text-white
              transition-all
              hover:bg-red-700
              disabled:opacity-50
            "
          >
            {loading
              ? "Removing..."
              : "Remove Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}