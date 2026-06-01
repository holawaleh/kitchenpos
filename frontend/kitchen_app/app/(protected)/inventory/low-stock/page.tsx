"use client";

import { useEffect, useState }
from "react";

import {
  AlertTriangle,
  Package,
} from "lucide-react";

import apiClient
from "@/lib/api-client";

interface Product {
  id: number;

  name: string;

  quantity: string;

  stock_status:
    | "IN_STOCK"
    | "LOW_STOCK"
    | "OUT_OF_STOCK";

  default_price: string;
}

export default function LowStockPage() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadLowStock() {

    try {

      const response =
        await apiClient.get(
          "/inventory/low-stock/"
        );

      setProducts(
        response.data.results || []
      );

    } catch (error) {

      console.error(error);

      setError(
        "Failed to load low stock products"
      );

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    loadLowStock();

  }, []);

  if (loading) {

    return (
      <div
        className="
          flex min-h-[400px]
          items-center
          justify-center
          text-xl
          font-semibold
          text-zinc-500
        "
      >
        Loading inventory alerts...
      </div>
    );
  }

  if (error) {

    return (
      <div
        className="
          flex min-h-[400px]
          items-center
          justify-center
          text-xl
          font-semibold
          text-red-500
        "
      >
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <div
          className="
            flex items-center
            gap-4
          "
        >

          <div
            className="
              flex h-16
              w-16
              items-center
              justify-center
              rounded-3xl
              bg-yellow-100
            "
          >
            <AlertTriangle
              className="
                h-8 w-8
                text-yellow-700
              "
            />
          </div>

          <div>

            <h1
              className="
                text-5xl
                font-black
                tracking-tight
              "
            >
              Low Stock
            </h1>

            <p
              className="
                mt-2
                text-lg
                text-zinc-500
              "
            >
              Inventory warning
              and restock monitoring
            </p>
          </div>
        </div>
      </div>

      {/* SUMMARY */}

      <div
        className="
          rounded-[32px]
          border
          border-yellow-200
          bg-yellow-50
          p-6
        "
      >

        <div
          className="
            flex items-center
            justify-between
          "
        >

          <div>

            <p
              className="
                text-sm
                font-semibold
                text-zinc-500
              "
            >
              Products Requiring Attention
            </p>

            <h2
              className="
                mt-3
                text-5xl
                font-black
                text-yellow-700
              "
            >
              {
                products.length
              }
            </h2>
          </div>

          <div
            className="
              flex h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              bg-yellow-100
            "
          >
            <Package
              className="
                h-10 w-10
                text-yellow-700
              "
            />
          </div>
        </div>
      </div>

      {/* PRODUCTS */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          md:grid-cols-2
          xl:grid-cols-3
        "
      >

        {products.length === 0 ? (

          <div
            className="
              col-span-full
              rounded-[32px]
              border
              border-zinc-200
              bg-white
              py-24
              text-center
            "
          >

            <div
              className="
                mx-auto
                flex h-20
                w-20
                items-center
                justify-center
                rounded-3xl
                bg-emerald-100
              "
            >
              ✅
            </div>

            <h2
              className="
                mt-6
                text-3xl
                font-black
              "
            >
              Inventory Healthy
            </h2>

            <p
              className="
                mt-2
                text-zinc-500
              "
            >
              No low stock products found
            </p>
          </div>

        ) : (

          products.map(
            (product) => (

              <div
                key={product.id}
                className="
                  rounded-[32px]
                  border
                  border-zinc-200
                  bg-white
                  p-6
                  transition
                  hover:scale-[1.02]
                  hover:shadow-lg
                "
              >

                <div
                  className="
                    flex items-start
                    justify-between
                  "
                >

                  <div>

                    <h2
                      className="
                        text-2xl
                        font-black
                      "
                    >
                      {
                        product.name
                      }
                    </h2>

                    <p
                      className="
                        mt-2
                        text-zinc-500
                      "
                    >
                      Product ID:
                      {" "}
                      {product.id}
                    </p>
                  </div>

                  <div
                    className={`
                      rounded-full
                      px-3 py-1
                      text-xs
                      font-bold

                      ${
                        product.stock_status ===
                        "OUT_OF_STOCK"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >
                    {
                      product.stock_status ===
                      "OUT_OF_STOCK"
                        ? "OUT OF STOCK"
                        : "LOW STOCK"
                    }
                  </div>
                </div>

                <div
                  className="
                    mt-8
                    grid
                    grid-cols-2
                    gap-4
                  "
                >

                  <div
                    className="
                      rounded-2xl
                      bg-zinc-100
                      p-4
                    "
                  >

                    <p
                      className="
                        text-sm
                        text-zinc-500
                      "
                    >
                      Remaining Stock
                    </p>

                    <h3
                      className="
                        mt-2
                        text-3xl
                        font-black
                      "
                    >
                      {
                        product.quantity
                      }
                    </h3>
                  </div>

                  <div
                    className="
                      rounded-2xl
                      bg-zinc-100
                      p-4
                    "
                  >

                    <p
                      className="
                        text-sm
                        text-zinc-500
                      "
                    >
                      Unit Price
                    </p>

                    <h3
                      className="
                        mt-2
                        text-3xl
                        font-black
                      "
                    >
                      ₦
                      {
                        product.default_price
                      }
                    </h3>
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}