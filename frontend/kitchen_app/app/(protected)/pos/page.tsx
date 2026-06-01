// app/(protected)/pos/page.tsx

"use client";

import { useState } from "react";

import {
  Search,
  ShoppingCart,
} from "lucide-react";

import CheckoutModal from "@/features/pos/components/checkout-modal";

import createSale
from "@/lib/api-client";

import { ReceiptModal }
from "@/features/sales/components/receipt-modal";

import {
  getSaleDetail,
} from "@/features/sales/services/sale-detail.service";

import { usePosProducts }
from "@/features/pos/hooks/use-pos-products";

import {
  CartItem,
  PosProduct,
} from "@/features/pos/types/pos.types";

const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export default function PosPage() {
  const [page] =
    useState(1);

  const {
    products,
    loading,
    error,
    search,
    setSearch,
  } = usePosProducts(page);

  const [cart, setCart] =
    useState<CartItem[]>(
      []
    );

  const [
    checkoutOpen,
    setCheckoutOpen,
  ] = useState(false);

  const [
    receiptOpen,
    setReceiptOpen,
  ] = useState(false);

  const [
    receiptData,
    setReceiptData,
  ] = useState<any>(null);

  function addToCart(
    product: PosProduct
  ) {
    if (
      product.stock_status ===
      "OUT_OF_STOCK"
    ) {
      return;
    }

    setCart((prev) => {
      const existing =
        prev.find(
          (item) =>
            item.product_id ===
            product.id
        );

      if (existing) {

  if (
  existing.quantity >=
  Number(product.quantity)
) {
  return prev;
}

  return prev.map(
          (item) =>
            item.product_id ===
            product.id
              ? {
                  ...item,

                  quantity:
                    item.quantity + 1,

                  subtotal:
                    (item.quantity + 1) *
                    item.price,
                }
              : item
        );
      }

      return [
        ...prev,

        {
          product_id:
            product.id,

          name:
            product.name,

          price: Number(
            product.default_price
          ),

          quantity: 1,

          subtotal: Number(
            product.default_price
          ),
        },
      ];
    });
  }

  function increaseQuantity(
  productId: number
) {
  const product =
    products.find(
      (p) => p.id === productId
    );

  if (!product) {
    return;
  }

  setCart((prev) =>
    prev.map((item) => {

      if (
        item.product_id !==
        productId
      ) {
        return item;
      }

     if (
  item.quantity >=
  Number(product.quantity)
) {
  return item;
}

      return {
        ...item,

        quantity:
          item.quantity + 1,

        subtotal:
          (item.quantity + 1) *
          item.price,
      };
    })
  );
}

  function decreaseQuantity(
    productId: number
  ) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product_id ===
          productId
            ? {
                ...item,

                quantity:
                  item.quantity - 1,

                subtotal:
                  (item.quantity - 1) *
                  item.price,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  }

  function updateQuantity(
  productId: number,
  quantity: number
) {
  const product =
    products.find(
      (p) => p.id === productId
    );

  if (!product) {
    return;
  }

  const maxQuantity =
    Number(product.quantity);

  if (quantity < 1) {
    quantity = 1;
  }

  if (
    quantity > maxQuantity
  ) {
    quantity =
      maxQuantity;
  }

  setCart((prev) =>
    prev.map((item) =>
      item.product_id ===
      productId
        ? {
            ...item,

            quantity,

            subtotal:
              quantity *
              item.price,
          }
        : item
    )
  );
}

  function removeItem(
    productId: number
  ) {
    setCart((prev) =>
      prev.filter(
        (item) =>
          item.product_id !==
          productId
      )
    );
  }

  async function handleCheckout(
  payload: any
) {
  try {
    const salePayload = {
      customer_name:
        payload.customer_name,

      payment_method:
        payload.payment_method,

      amount_paid:
        payload.amount_paid,

      items: cart.map(
        (item) => ({
          product_id:
            item.product_id,

          quantity:
            item.quantity,

          unit_price:
            item.price,

          subtotal:
            item.subtotal,
        })
      ),
    };

    const response =
      await createSale.post(
        "/sales/checkout/",
        salePayload
      );

    console.log(
      "CHECKOUT RESPONSE:",
      response.data
    );

    const saleId =
      response.data?.id ||
      response.data?.sale_id ||
      response.data?.data?.id ||
      response.data?.data?.sale_id;

    console.log(
      "SALE ID:",
      saleId
    );

    setCart([]);

    setCheckoutOpen(
      false
    );

    if (!saleId) {
      console.error(
        "NO SALE ID FOUND"
      );

      return;
    }

    try {
      const receipt =
        await getSaleDetail(
          saleId
        );

      console.log(
        "RECEIPT:",
        receipt
      );

      setReceiptData(
        receipt
      );

      setReceiptOpen(
        true
      );
    } catch (error) {
      console.error(
        "RECEIPT ERROR:",
        error
      );
    }
  } catch (error) {
    console.error(
      "CHECKOUT ERROR:",
      error
    );
  }
}

  const total =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        item.subtotal,
      0
    );

  return (
    <>
      <div
        className="
          grid
          grid-cols-1
          gap-4
          xl:grid-cols-[1fr_340px]
        "
      >
        {/* LEFT */}

        <div className="min-w-0">
          <div
            className="
              mb-6 flex
              flex-col gap-5
              xl:flex-row
              xl:items-center
              xl:justify-between
            "
          >
            <div>
              <h1
                className="
                  text-3xl
                  font-black
                  sm:text-4xl
                "
              >
                POS
              </h1>

              <p
                className="
                  mt-2
                  text-zinc-500
                "
              >
                Cashier terminal
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
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="
                  h-14 w-full
                  rounded-2xl
                  border
                  border-zinc-300
                  bg-white
                  pl-12 pr-4
                  outline-none
                  xl:w-[360px]
                "
              />
            </div>
          </div>

          {loading ? (
            <div>
              Loading products...
            </div>
          ) : error ? (
            <div
              className="
                text-red-500
              "
            >
              {error}
            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-3
                lg:grid-cols-3
                xl:grid-cols-4
                2xl:grid-cols-5
              "
            >
              {products.map(
                (product) => (
                  <button
                    key={
                      product.id
                    }
                    onClick={() =>
                      addToCart(
                        product
                      )
                    }
                    disabled={
                      product.stock_status ===
                      "OUT_OF_STOCK"
                    }
                    className="
                      min-h-[150px]
                      rounded-2xl
                      border
                      border-zinc-200
                      bg-white
                      p-4
                      text-left
                      active:scale-[0.98]
                      disabled:opacity-50
                    "
                  >
                    <div
                      className="
                        mb-3 flex
                        h-12 w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-zinc-100
                      "
                    >
                      📦
                    </div>

                    <h3
                      className="
                        text-base
                        font-bold
                        sm:text-lg
                      "
                    >
                      {
                        product.name
                      }
                    </h3>

<p
  className={`
    mt-2
    text-sm
    font-bold

    ${
      Number(product.quantity) <= 0
        ? "text-red-500"
        : Number(product.quantity) <= 10
        ? "text-yellow-500"
        : "text-emerald-600"
    }
  `}
>
  Left:
  {" "}
  {Number(product.quantity)}
</p>

                    
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* RIGHT */}

        <div
          className="
            rounded-[32px]
            border
            border-zinc-200
            bg-white
            p-4
            sm:p-6
            xl:sticky
            xl:top-6
            xl:max-h-[calc(100vh-8rem)]
            xl:overflow-y-auto
          "
        >
          <div
            className="
              mb-6 flex
              items-center
              gap-3
            "
          >
            <ShoppingCart
              className="
                h-8 w-8
              "
            />

            <h2
              className="
                text-2xl
                font-black
                sm:text-3xl
              "
            >
              Cart
            </h2>
          </div>

          <div className="space-y-4">
            {cart.length === 0 ? (
              <div
                className="
                  py-20 text-center
                  text-zinc-400
                "
              >
                Cart is empty
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={
                    item.product_id
                  }
                  className="
                    rounded-2xl
                    border
                    border-zinc-200
                    p-3
                  "
                >
                  <div
                    className="
                      flex items-start
                      justify-between
                    "
                  >
                    <div>
                      <h3
                        className="
                          font-bold
                        "
                      >
                        {item.name}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-zinc-500
                        "
                      >
                        ₦
                        {item.price}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        removeItem(
                          item.product_id
                        )
                      }
                      className="
                        text-red-500
                      "
                    >
                      ✕
                    </button>
                  </div>

                  <div
                    className="
                      mt-3 flex
                      items-center
                      justify-between
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.product_id
                          )
                        }
                        className="
                          flex h-11 w-11
                          items-center
                          justify-center
                          rounded-lg
                          border
                        "
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min="1"
                        value={
                          item.quantity
                        }
                        onChange={(e) =>
                          updateQuantity(
                            item.product_id,
                            Number(
                              e.target
                                .value
                            )
                          )
                        }
                        className="
                          h-11
                          w-20
                          rounded-lg
                          border
                          text-center
                          outline-none
                        "
                      />

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.product_id
                          )
                        }
                        className="
                          flex h-11 w-11
                          items-center
                          justify-center
                          rounded-lg
                          border
                        "
                      >
                        +
                      </button>
                    </div>

                    <p
                      className="
                        text-lg
                        font-black
                      "
                    >
                      ₦
                      {item.subtotal}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div
            className="
              mt-8 border-t
              border-zinc-200
              pt-6
            "
          >
            <div
              className="
                mb-6 flex
                items-center
                justify-between
              "
            >
              <span>
                Total
              </span>

              <span
                className="
                  text-3xl
                  font-black
                  sm:text-4xl
                "
              >
                ₦{total}
              </span>
            </div>

            <button
              onClick={() =>
                setCheckoutOpen(
                  true
                )
              }
              disabled={
                cart.length === 0
              }
              className="
                h-16 w-full
                rounded-2xl
                bg-black
                text-lg
                font-bold
                text-white
                disabled:opacity-40
              "
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {cart.length > 0 && (
        <button
          onClick={() =>
            setCheckoutOpen(
              true
            )
          }
          className="
            fixed bottom-20 left-4 right-4 z-30
            flex h-14 items-center justify-between
            rounded-2xl bg-black px-5
            font-bold text-white shadow-xl
            xl:hidden
          "
        >
          <span>
            {cart.length} item(s)
          </span>

          <span>
            Checkout {formatCurrency(total)}
          </span>
        </button>
      )}

      {/* CHECKOUT */}

      <CheckoutModal
        open={checkoutOpen}
        onClose={() =>
          setCheckoutOpen(
            false
          )
        }
        total={total}
        onSubmit={handleCheckout}
      />

      {/* RECEIPT */}

      <ReceiptModal
        open={receiptOpen}
        onClose={() =>
          setReceiptOpen(
            false
          )
        }
        receipt={receiptData}
      />
    </>
  );
}
