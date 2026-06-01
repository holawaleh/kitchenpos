"use client";

import { useState } from "react";

import {
  Package,
  Search,
} from "lucide-react";

import { useInventory }
from "@/features/inventory/hooks/use-inventory";

import { AddStockModal }
from "@/features/inventory/components/add-stock-modal";

import { RemoveStockModal }
from "@/features/inventory/components/remove-stock-modal";

import { StockHistoryModal }
from "@/features/inventory/components/stock-history-modal";

import {
  InventoryItem,
} from "@/features/inventory/types/inventory.types";

export default function InventoryPage() {
  const [page, setPage] =
    useState(1);

  const {
    inventory,
    count,
    loading,
    error,
    search,
    setSearch,
    refresh,
  } = useInventory(page);

  const [
    selectedItem,
    setSelectedItem,
  ] =
    useState<InventoryItem | null>(
      null
    );

  const [
    addModalOpen,
    setAddModalOpen,
  ] = useState(false);

  const [
    removeModalOpen,
    setRemoveModalOpen,
  ] = useState(false);

  const [
    historyModalOpen,
    setHistoryModalOpen,
  ] = useState(false);

  return (
    <div
  className="
    min-w-0
    overflow-x-hidden
    p-8
  "
>
      <div
        className="
          flex items-start
          justify-between
        "
      >
        <div>
          <h1
            className="
              text-5xl
xl:text-6xl
              font-black
              tracking-tight
            "
          >
            Inventory
          </h1>

          <p
            className="
              mt-3
              text-xl
              text-zinc-500
            "
          >
            Manage stock levels
          </p>
        </div>

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
            placeholder="Search inventory..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              h-16 w-[360px]
              rounded-3xl
              border
              border-zinc-300
              bg-white
              pl-12 pr-5
              text-lg
              outline-none
            "
          />
        </div>
      </div>

      {/* METRICS */}

      <div
        className="
          mt-8 grid
          grid-cols-1
gap-4
md:grid-cols-2
2xl:grid-cols-4
        "
      >
        <div
          className="
            rounded-3xl
            border
            border-zinc-200
            bg-white p-5
          "
        >
          <p
            className="
              text-sm
              text-zinc-500
            "
          >
            Total SKUs
          </p>

          <h3
            className="
              mt-2 text-4xl
              font-black
            "
          >
            {count}
          </h3>
        </div>

        <div
          className="
            rounded-3xl
            border
            border-yellow-200
            bg-yellow-50 p-5
          "
        >
          <p
            className="
              text-sm
              text-yellow-700
            "
          >
            Low Stock
          </p>

          <h3
            className="
              mt-2 text-4xl
              font-black
              text-yellow-700
            "
          >
            {
              inventory.filter(
                (item) =>
                  Number(
                    item.quantity
                  ) > 0 &&
                  Number(
                    item.quantity
                  ) <=
                    Number(
                      item.low_stock_threshold
                    )
              ).length
            }
          </h3>
        </div>

        <div
          className="
            rounded-3xl
            border
            border-red-200
            bg-red-50 p-5
          "
        >
          <p
            className="
              text-sm
              text-red-700
            "
          >
            Out of Stock
          </p>

          <h3
            className="
              mt-2 text-4xl
              font-black
              text-red-700
            "
          >
            {
              inventory.filter(
                (item) =>
                  Number(
                    item.quantity
                  ) === 0
              ).length
            }
          </h3>
        </div>

        <div
          className="
            rounded-3xl
            border
            border-zinc-200
            bg-white p-5
          "
        >
          <p
            className="
              text-sm
              text-zinc-500
            "
          >
            Total Units
          </p>

          <h3
            className="
              mt-2 text-4xl
              font-black
            "
          >
            {
              inventory.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  Number(
                    item.quantity
                  ),
                0
              )
            }
          </h3>
        </div>
      </div>

      {/* TABLE */}

      <div
        className="
          mt-8
          w-full
          overflow-x-auto
          rounded-3xl
          border
          border-zinc-200
          bg-white
        "
      >
        <table
  className="
    min-w-full
    table-auto
  "
>
          <thead
            className="
              border-b
              border-zinc-200
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
              <th className="px-8 py-6">
                Product
              </th>

              <th className="px-6 py-6">
                Barcode
              </th>

              <th className="px-6 py-6">
                Quantity
              </th>

              <th className="px-6 py-6">
                Threshold
              </th>

              <th className="px-6 py-6">
                Status
              </th>

              <th className="px-6 py-6">
                Updated
              </th>

              <th className="px-6 py-6">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="
                    py-16 text-center
                    text-zinc-500
                  "
                >
                  Loading inventory...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={7}
                  className="
                    py-16 text-center
                    text-red-500
                  "
                >
                  {error}
                </td>
              </tr>
            ) : inventory.length ===
              0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="
                    py-16 text-center
                    text-zinc-500
                  "
                >
                  No inventory found
                </td>
              </tr>
            ) : (
              inventory.map(
                (item) => (
                  <tr
                    key={item.id}
                    className="
                      border-b
                      border-zinc-100
                    "
                  >
                    <td className="px-8 py-4">
                      <div
                        className="
                          flex items-center
                          gap-4
                        "
                      >
                        <div
                          className="
                            flex h-12 w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-zinc-100
                          "
                        >
                          <Package
                            className="
                              h-5 w-5
                              text-zinc-500
                            "
                          />
                        </div>

                        <span
                          className="
                            text-xl
                            font-semibold
                          "
                        >
                          {
                            item.product
                              .name
                          }
                        </span>
                      </div>
                    </td>

                    <td
                      className="
                        px-6 py-4
                        text-zinc-500
                      "
                    >
                      {item.product
                        .barcode ||
                        "-"}
                    </td>

                    <td className="px-6 py-4">
                      <div
                        className={`
                          inline-flex
                          rounded-2xl
                          px-4 py-2
                          text-lg
                          font-black

                          ${
                            Number(
                              item.quantity
                            ) === 0
                              ? "bg-red-50 text-red-700"

                              : Number(
                                  item.quantity
                                ) <=
                                Number(
                                  item.low_stock_threshold
                                )
                              ? "bg-yellow-50 text-yellow-700"

                              : "bg-zinc-100 text-zinc-900"
                          }
                        `}
                      >
                        {
                          item.quantity
                        }
                      </div>
                    </td>

                    <td
                      className="
                        px-6 py-4
                        text-xl
                        font-semibold
                      "
                    >
                      {
                        item.low_stock_threshold
                      }
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`
                          rounded-full
                          px-4 py-2
                          text-xs
                          font-bold

                          ${
                            Number(
                              item.quantity
                            ) === 0
                              ? "bg-red-100 text-red-700"

                              : Number(
                                  item.quantity
                                ) <=
                                Number(
                                  item.low_stock_threshold
                                )
                              ? "bg-yellow-100 text-yellow-700"

                              : "bg-emerald-100 text-emerald-700"
                          }
                        `}
                      >
                        {Number(
                          item.quantity
                        ) === 0
                          ? "OUT OF STOCK"

                          : Number(
                              item.quantity
                            ) <=
                            Number(
                              item.low_stock_threshold
                            )
                          ? "LOW STOCK"

                          : "IN STOCK"}
                      </span>
                    </td>

                    <td
                      className="
                        px-6 py-4
                        text-sm
                        text-zinc-500
                      "
                    >
                      {new Date(
                        item.updated_at
                      ).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(
                              item
                            );

                            setAddModalOpen(
                              true
                            );
                          }}
                          className="
                            rounded-xl
                            bg-emerald-600
                            px-4 py-2
                            text-xs
                            font-bold
                            text-white
                            transition-all
                            hover:bg-emerald-700
                          "
                        >
                          + Stock
                        </button>

                        <button
                          onClick={() => {
                            setSelectedItem(
                              item
                            );

                            setRemoveModalOpen(
                              true
                            );
                          }}
                          className="
                            rounded-xl
                            bg-red-50
                            px-4 py-2
                            text-xs
                            font-bold
                            text-red-700
                            transition-all
                            hover:bg-red-100
                          "
                        >
                          - Stock
                        </button>

                        <button
                          onClick={() => {
                            setSelectedItem(
                              item
                            );

                            setHistoryModalOpen(
                              true
                            );
                          }}
                          className="
                            rounded-xl
                            border
                            border-zinc-300
                            bg-white
                            px-4 py-2
                            text-xs
                            font-bold
                            text-zinc-700
                            transition-all
                            hover:bg-zinc-100
                          "
                        >
                          History
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      <div
        className="
          mt-6 flex
          items-center
          justify-between
        "
      >
        <p
          className="
            text-lg
            text-zinc-500
          "
        >
          Total Items: {count}
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
              px-6 py-3
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
              inventory.length ===
              0
            }
            className="
              rounded-2xl
              border
              border-zinc-300
              bg-white
              px-6 py-3
              font-medium
              disabled:opacity-40
            "
          >
            Next
          </button>
        </div>
      </div>

      {/* MODALS */}

      {selectedItem && (
        <>
          <AddStockModal
            open={
              addModalOpen
            }
            onClose={() =>
              setAddModalOpen(
                false
              )
            }
            onSuccess={
              refresh
            }
            item={selectedItem}
          />

          <RemoveStockModal
            open={
              removeModalOpen
            }
            onClose={() =>
              setRemoveModalOpen(
                false
              )
            }
            onSuccess={
              refresh
            }
            item={selectedItem}
          />

          <StockHistoryModal
            open={
              historyModalOpen
            }
            onClose={() =>
              setHistoryModalOpen(
                false
              )
            }
            item={selectedItem}
          />
        </>
      )}
    </div>
  );
}