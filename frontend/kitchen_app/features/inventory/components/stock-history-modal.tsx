"use client";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import apiClient
from "../../../lib/api-client";

import {
  InventoryItem,
} from "../types/inventory.types";

interface Movement {
  id: number;

  movement_type:
    | "IN"
    | "OUT";

  quantity: string;

  note: string;

  performed_by: string;

  created_at: string;
}

interface Props {
  open: boolean;

  onClose: () => void;

  item: InventoryItem;
}

export function StockHistoryModal({
  open,
  onClose,
  item,
}: Props) {
  const [
    movements,
    setMovements,
  ] = useState<
    Movement[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  async function fetchHistory() {
    try {
      setLoading(true);

      const response =
        await apiClient.get(
          "/inventory/movements/",
          {
            params: {
              product:
                item.product.id,
            },
          }
        );

      setMovements(
        response.data.results
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load stock history"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      fetchHistory();
    }
  }, [open]);

  if (!open) return null;

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
          w-full max-w-2xl
          rounded-3xl
          bg-white p-6
          shadow-2xl
        "
      >
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
                font-bold
              "
            >
              Stock History
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

          <button
            onClick={onClose}
            className="
              rounded-xl
              border
              border-zinc-300
              px-4 py-2
              text-sm
            "
          >
            Close
          </button>
        </div>

        <div
          className="
            max-h-75
            overflow-y-auto
          "
        >
          {loading ? (
            <div
              className="
                py-10 text-center
                text-zinc-500
              "
            >
              Loading history...
            </div>
          ) : movements.length ===
            0 ? (
            <div
              className="
                py-10 text-center
                text-zinc-500
              "
            >
              No stock history found
            </div>
          ) : (
            <div className="space-y-4">
              {movements.map(
                (movement) => (
                  <div
                    key={
                      movement.id
                    }
                    className="
                      flex items-start
                      justify-between
                      rounded-2xl
                      border
                      border-zinc-200
                      p-4
                    "
                  >
                    <div>
                      <div
                        className="
                          flex items-center
                          gap-3
                        "
                      >
                        <span
                          className={`
                            rounded-full
                            px-3 py-1
                            text-xs
                            font-semibold
                            ${
                              movement.movement_type ===
                              "IN"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }
                          `}
                        >
                          {
                            movement.movement_type
                          }
                        </span>

                        <span
                          className="
                            text-lg
                            font-bold
                          "
                        >
                          {
                            movement.quantity
                          }
                        </span>
                      </div>

                      <p
                        className="
                          mt-2 text-sm
                          text-zinc-600
                        "
                      >
                        {
                          movement.note ||
                          "No note"
                        }
                      </p>

                      <p
                        className="
                          mt-2 text-xs
                          text-zinc-400
                        "
                      >
                        By{" "}
                        {
                          movement.performed_by
                        }
                      </p>
                    </div>

                    <div
                      className="
                        text-right
                        text-xs
                        text-zinc-400
                      "
                    >
                      {new Date(
                        movement.created_at
                      ).toLocaleString()}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}