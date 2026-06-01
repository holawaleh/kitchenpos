"use client";

import { useMemo, useState } from "react";

import { Plus, Search } from "lucide-react";

import { toast } from "sonner";

import { useProducts } from "@/features/products/hooks/use-products";

import {
  deleteProduct,
} from "@/features/products/services/product.service";

import {
  Product,
} from "@/features/products/types/product.types";

import {
  CreateProductModal,
} from "@/features/products/components/create-product-modal";

import {
  EditProductModal,
} from "@/features/products/components/edit-product-modal";

export default function ProductsPage() {
  const [page, setPage] =
    useState(1);

  const {
    products,
    count,
    loading,
    error,
    search,
    setSearch,
    refresh,
  } = useProducts(page);

  const [
    createOpen,
    setCreateOpen,
  ] = useState(false);

  const [
    editOpen,
    setEditOpen,
  ] = useState(false);

  const [
    selectedProduct,
    setSelectedProduct,
  ] =
    useState<Product | null>(
      null
    );

  const totalPages =
    useMemo(() => {
      return Math.ceil(
        count / 10
      );
    }, [count]);

  async function handleDelete(
    productId: number
  ) {
    try {
      await deleteProduct(
        productId
      );

      toast.success(
        "Product deleted"
      );

      refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete product"
      );
    }
  }

  return (
    <div className="p-6">
      {/* HEADER */}

      <div
        className="
          mb-6 flex
          items-start
          justify-between
        "
      >
        <div>
          <h1
            className="
              text-5xl
              font-bold
            "
          >
            Products
          </h1>

          <p
            className="
              mt-2 text-zinc-500
            "
          >
            Manage restaurant
            products
          </p>
        </div>

        <div
          className="
            flex items-center
            gap-4
          "
        >
          <div className="relative">
            <Search
              size={18}
              className="
                absolute
                left-4 top-1/2
                -translate-y-1/2
                text-zinc-400
              "
            />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
                h-12 w-72
                rounded-2xl
                border
                border-zinc-300
                bg-white
                pl-12 pr-4
                text-sm
                outline-none
              "
            />
          </div>

          <button
            onClick={() =>
              setCreateOpen(true)
            }
            className="
              flex h-12
              items-center
              gap-2 rounded-2xl
              bg-cyan-500
              px-6
              text-sm font-medium
              text-white
            "
          >
            <Plus size={18} />

            Add Product
          </button>
        </div>
      </div>

      {/* TABLE */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          border
          border-zinc-200
          bg-white
        "
      >
        <table className="w-full">
          <thead
            className="
              border-b
              border-zinc-200
              bg-zinc-50
            "
          >
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-zinc-500">
                Product
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-zinc-500">
                Barcode
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-zinc-500">
                Price
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-zinc-500">
                Type
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-zinc-500">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-zinc-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="
                    px-6 py-10
                    text-center
                    text-zinc-500
                  "
                >
                  Loading products...
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td
                  colSpan={6}
                  className="
                    px-6 py-10
                    text-center
                    text-red-500
                  "
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              products.map(
                (product) => (
                  <tr
                    key={
                      product.id
                    }
                    className="
                      border-b
                      border-zinc-100
                    "
                  >
                    <td className="px-6 py-5">
                      <div
                        className="
                          flex items-center
                          gap-3
                        "
                      >
                        <div
                          className="
                            flex h-10
                            w-10 items-center
                            justify-center
                            rounded-xl
                            bg-zinc-100
                          "
                        >
                          📦
                        </div>

                        <span className="font-medium">
                          {
                            product.name
                          }
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-zinc-500">
                      {product.barcode ||
                        "-"}
                    </td>

                    <td className="px-6 py-5 font-medium">
                      ₦
                      {
                        product.default_price
                      }
                    </td>

                    <td className="px-6 py-5">
                      {
                        product.product_type
                      }
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className="
                          rounded-full
                          bg-green-100
                          px-3 py-1
                          text-xs
                          font-semibold
                          text-green-700
                        "
                      >
                        {
                          product.status
                        }
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(
                              product
                            );

                            setEditOpen(
                              true
                            );
                          }}
                          className="
                            rounded-lg
                            border
                            border-zinc-300
                            px-3 py-1.5
                            text-sm
                          "
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              product.id
                            )
                          }
                          className="
                            rounded-lg
                            border
                            border-red-200
                            px-3 py-1.5
                            text-sm
                            text-red-500
                          "
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}

      <div
        className="
          mt-4 flex
          items-center
          justify-between
        "
      >
        <p className="text-sm text-zinc-500">
          Total Products:
          {" "}
          {count}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() =>
              setPage(page - 1)
            }
            className="
              rounded-xl
              border
              border-zinc-300
              px-4 py-2
              text-sm
            "
          >
            Previous
          </button>

          <button
            disabled={
              page >= totalPages
            }
            onClick={() =>
              setPage(page + 1)
            }
            className="
              rounded-xl
              border
              border-zinc-300
              px-4 py-2
              text-sm
            "
          >
            Next
          </button>
        </div>
      </div>

      {/* CREATE MODAL */}

      <CreateProductModal
        open={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
        onSuccess={refresh}
      />

      {/* EDIT MODAL */}

      {selectedProduct && (
        <EditProductModal
          open={editOpen}
          onClose={() =>
            setEditOpen(false)
          }
          product={
            selectedProduct
          }
          onSuccess={refresh}
        />
      )}
    </div>
  );
}