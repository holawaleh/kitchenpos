"use client";

import { useState } from "react";

import { toast } from "sonner";

import { createProduct } from "../services/product.service";

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateProductModal({
  open,
  onClose,
  onSuccess,
}: CreateProductModalProps) {
  const [name, setName] =
    useState("");

  const [barcode, setBarcode] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [productType, setProductType] =
    useState<
      "COUNTABLE" | "FLEXIBLE"
    >("COUNTABLE");

  const [status, setStatus] =
    useState<
      "AVAILABLE" | "FINISHED"
    >("AVAILABLE");

  const [loading, setLoading] =
    useState(false);

  async function handleCreate() {
    try {
      setLoading(true);

      await createProduct({
        name,
        barcode,
        default_price:
          Number(price),
        product_type:
          productType,
        status,
      });

      toast.success(
        "Product created successfully"
      );

      onSuccess?.();

      onClose();

      setName("");
      setBarcode("");
      setPrice("");

      setProductType(
        "COUNTABLE"
      );

      setStatus(
        "AVAILABLE"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center
        justify-center
        bg-black/40
        p-4
      "
    >
      <div
        className="
          w-full max-w-4xl
          rounded-3xl
          border p-8
        "
        style={{
          background:
            "var(--card)",

          borderColor:
            "var(--sidebar-border)",
        }}
      >
        <div
          className="
            mb-8 flex
            items-start
            justify-between
          "
        >
          <div>
            <h2
              className="
                text-4xl
                font-bold
              "
            >
              Create Product
            </h2>

            <p
              className="
                mt-2 text-lg
                opacity-70
              "
            >
              Add new restaurant
              product
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              text-4xl
              opacity-60
              hover:opacity-100
            "
          >
            ×
          </button>
        </div>

        <div
          className="
            grid grid-cols-1
            gap-6 md:grid-cols-2
          "
        >
          <div>
            <label
              className="
                mb-3 block
                text-2xl
              "
            >
              Product Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="
                h-16 w-full
                rounded-2xl
                border px-6
                text-2xl
                outline-none
              "
            />
          </div>

          <div>
            <label
              className="
                mb-3 block
                text-2xl
              "
            >
              Barcode
            </label>

            <input
              type="text"
              value={barcode}
              onChange={(e) =>
                setBarcode(
                  e.target.value
                )
              }
              className="
                h-16 w-full
                rounded-2xl
                border px-6
                text-2xl
                outline-none
              "
            />
          </div>

          <div>
            <label
              className="
                mb-3 block
                text-2xl
              "
            >
              Price
            </label>

            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              className="
                h-16 w-full
                rounded-2xl
                border px-6
                text-2xl
                outline-none
              "
            />
          </div>

          <div>
            <label
              className="
                mb-3 block
                text-2xl
              "
            >
              Product Type
            </label>

            <select
              value={productType}
              onChange={(e) =>
                setProductType(
                  e.target.value as
                    | "COUNTABLE"
                    | "FLEXIBLE"
                )
              }
              className="
                h-16 w-full
                rounded-2xl
                border px-6
                text-2xl
                outline-none
              "
            >
              <option value="COUNTABLE">
                Countable
              </option>

              <option value="FLEXIBLE">
                Flexible
              </option>
            </select>
          </div>

          <div>
            <label
              className="
                mb-3 block
                text-2xl
              "
            >
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as
                    | "AVAILABLE"
                    | "FINISHED"
                )
              }
              className="
                h-16 w-full
                rounded-2xl
                border px-6
                text-2xl
                outline-none
              "
            >
              <option value="AVAILABLE">
                Available
              </option>

              <option value="FINISHED">
                Finished
              </option>
            </select>
          </div>
        </div>

        <div
          className="
            mt-10 flex
            justify-end gap-4
          "
        >
          <button
            onClick={onClose}
            className="
              rounded-2xl
              border px-8 py-4
              text-2xl
            "
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="
              rounded-2xl
              bg-cyan-500
              px-10 py-4
              text-2xl
              font-semibold
              text-white
              disabled:opacity-50
            "
          >
            {loading
              ? "Creating..."
              : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}