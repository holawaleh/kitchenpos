"use client";

import { useState } from "react";

import { toast } from "sonner";

import {
  addStock,
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

export function AddStockModal({
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

  async function handleAddStock() {
    if (!quantity) {
      toast.error(
        "Quantity is required"
      );

      return;
    }

    try {
      setLoading(true);

      await addStock({
        product_id:
          item.product.id,

        quantity:
          Number(quantity),

        note,
      });

      toast.success(
        "Stock added successfully"
      );

      setQuantity("");

      setNote("");

      await onSuccess();

      onClose();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to add stock"
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
            Add Stock
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
              focus:border-green-500
            "
          />

          <textarea
            placeholder="Note (optional)"
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
              focus:border-green-500
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
              handleAddStock
            }
            disabled={loading}
            className="
              rounded-2xl
              bg-emerald-600
              px-5 py-3
              text-sm
              font-semibold
              text-white
              transition-all
              hover:bg-emerald-700
              disabled:opacity-50
            "
          >
            {loading
              ? "Adding..."
              : "Add Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}