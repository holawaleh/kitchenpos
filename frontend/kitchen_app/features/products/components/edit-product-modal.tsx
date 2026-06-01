"use client";

import { useState } from "react";

import { toast } from "sonner";

import {
  updateProduct,
} from "../services/product.service";

import {
  Product,
} from "../types/product.types";

interface Props {
  open: boolean;

  onClose: () => void;

  onSuccess: () => void;

  product: Product;
}

export function EditProductModal({
  open,
  onClose,
  onSuccess,
  product,
}: Props) {
  const [name, setName] =
    useState(product.name);

  const [
    barcode,
    setBarcode,
  ] = useState(
    product.barcode || ""
  );

  const [
    price,
    setPrice,
  ] = useState(
    String(
      product.default_price
    )
  );

  const [
    productType,
    setProductType,
  ] = useState<
    "COUNTABLE" | "FLEXIBLE"
  >(product.product_type);

  const [status, setStatus] =
    useState<
      "AVAILABLE" | "FINISHED"
    >(product.status);

  const [loading, setLoading] =
    useState(false);

  if (!open) return null;

  async function handleUpdate() {
    try {
      setLoading(true);

      await updateProduct(
        product.id,
        {
          name,

          barcode,

          default_price:
            Number(price),

          product_type:
            productType,

          status,
        }
      );

      toast.success(
        "Product updated"
      );

      onSuccess();

      onClose();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update product"
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
      "
    >
      <div
        className="
          w-full max-w-xl
          rounded-3xl
          bg-white p-8
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
              Edit Product
            </h2>

            <p className="text-zinc-500">
              Update product
              information
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              text-2xl
              text-zinc-500
            "
          >
            ×
          </button>
        </div>

        <div className="space-y-5">
          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="Product name"
            className="
              h-12 w-full
              rounded-2xl
              border
              border-zinc-300
              px-4
              outline-none
            "
          />

          <input
            type="text"
            value={barcode}
            onChange={(e) =>
              setBarcode(
                e.target.value
              )
            }
            placeholder="Barcode"
            className="
              h-12 w-full
              rounded-2xl
              border
              border-zinc-300
              px-4
              outline-none
            "
          />

          <input
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value
              )
            }
            placeholder="Price"
            className="
              h-12 w-full
              rounded-2xl
              border
              border-zinc-300
              px-4
              outline-none
            "
          />

          <select
            value={productType}
            onChange={(e) =>
              setProductType(
                e.target
                  .value as
                  | "COUNTABLE"
                  | "FLEXIBLE"
              )
            }
            className="
              h-12 w-full
              rounded-2xl
              border
              border-zinc-300
              px-4
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

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target
                  .value as
                  | "AVAILABLE"
                  | "FINISHED"
              )
            }
            className="
              h-12 w-full
              rounded-2xl
              border
              border-zinc-300
              px-4
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

          <div
            className="
              flex justify-end
              gap-3 pt-4
            "
          >
            <button
              onClick={onClose}
              className="
                rounded-2xl
                border
                border-zinc-300
                px-5 py-3
              "
            >
              Cancel
            </button>

            <button
              onClick={
                handleUpdate
              }
              disabled={loading}
              className="
                rounded-2xl
                bg-cyan-500
                px-5 py-3
                font-medium
                text-white
              "
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}