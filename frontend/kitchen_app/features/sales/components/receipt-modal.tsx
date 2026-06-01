"use client";

interface Props {
  open: boolean;

  onClose: () => void;

  receipt: any;
}

export function ReceiptModal({
  open,
  onClose,
  receipt,
}: Props) {
  if (!open || !receipt) {
    return null;
  }

  const balance = Math.max(
    Number(receipt.balance || 0),
    0
  );

  const change = Math.max(
    Number(receipt.paid_amount || 0) -
      Number(receipt.total_amount || 0),
    0
  );

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <style>{`
  @media print {

    @page {
      size: 80mm auto;
      margin: 0;
    }

    html,
    body {
      width: 80mm;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: white;
    }

    body * {
      visibility: hidden;
    }

    #receipt-print,
    #receipt-print * {
      visibility: visible;
    }

    #receipt-print {
      position: absolute;
      left: 0;
      top: 0;
      width: 80mm;
      padding: 10px;
      background: white;
      box-sizing: border-box;
    }

    #receipt-actions {
      display: none !important;
    }

    button {
      display: none !important;
    }
  }
`}</style>

      <div
        className="
          fixed inset-0
          z-[100]
          flex
          items-center
          justify-center
          bg-black/50
          p-4
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-[32px]
            bg-white
            p-6
          "
        >
          {/* SCROLLABLE MODAL */}

          <div
            className="
              max-h-[80vh]
              overflow-y-auto
              pr-2
            "
          >
            {/* PRINT AREA */}

            <div id="receipt-print">
              {/* HEADER */}

              <div className="text-center">
                <h1
                  className="
                    text-5xl
                    font-black
                  "
                >
                  Kitchen POS
                </h1>

                <p
                  className="
                    mt-2
                    text-sm
                    tracking-[0.4em]
                    text-zinc-500
                  "
                >
                  RESTAURANT RECEIPT
                </p>
              </div>

              {/* INFO */}

              <div
                className="
                  mt-8
                  space-y-3
                  text-sm
                "
              >
                <div className="flex justify-between">
                  <span>Receipt</span>

                  <span className="font-bold">
                    {
                      receipt.receipt_number
                    }
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Cashier</span>

                  <span className="font-bold">
                    {
                      receipt.cashier_name
                    }
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Customer</span>

                  <span className="font-bold">
                    {receipt.customer_name ||
                      "Walk-in"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Method</span>

                  <span className="font-bold">
                    {
                      receipt.payment_method
                    }
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Status</span>

                  <span className="font-bold">
                    {
                      receipt.payment_status
                    }
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Date</span>

                  <span className="font-bold text-right">
                    {new Date(
                      receipt.created_at
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* ITEMS */}

              <div
                className="
                  mt-8
                  border-t
                  border-dashed
                  pt-6
                "
              >
                <div
                  className="
                    mb-4
                    grid
                    grid-cols-4
                    text-xs
                    font-bold
                  "
                >
                  <span>ITEM</span>

                  <span>QTY</span>

                  <span>PRICE</span>

                  <span className="text-right">
                    TOTAL
                  </span>
                </div>

                <div className="space-y-3">
                  {receipt.items?.map(
                    (
                      item: any,
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="
                          grid
                          grid-cols-4
                          text-sm
                        "
                      >
                        <span>
                          {
                            item.product_name
                          }
                        </span>

                        <span>
                          {
                            item.quantity
                          }
                        </span>

                        <span>
                          ₦
                          {
                            item.unit_price
                          }
                        </span>

                        <span className="text-right font-bold">
                          ₦
                          {
                            item.subtotal
                          }
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* TOTALS */}

              <div
                className="
                  mt-8
                  border-t
                  border-dashed
                  pt-6
                  space-y-4
                "
              >
                <div className="flex justify-between text-2xl font-black">
                  <span>Total</span>

                  <span>
                    ₦
                    {
                      receipt.total_amount
                    }
                  </span>
                </div>

                <div className="flex justify-between text-xl font-bold text-emerald-600">
                  <span>Paid</span>

                  <span>
                    ₦
                    {
                      receipt.paid_amount
                    }
                  </span>
                </div>

                {change > 0 ? (
                  <div className="flex justify-between text-xl font-bold text-blue-600">
                    <span>Change</span>

                    <span>
                      ₦{change}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between text-xl font-bold text-red-500">
                    <span>Balance</span>

                    <span>
                      ₦{balance}
                    </span>
                  </div>
                )}
              </div>

              {/* PAYMENTS */}

              {receipt.payments
                ?.length > 0 && (
                <div
                  className="
                    mt-8
                    border-t
                    border-dashed
                    pt-6
                  "
                >
                  <h3
                    className="
                      mb-4
                      text-sm
                      font-black
                    "
                  >
                    PAYMENTS
                  </h3>

                  <div className="space-y-4">
                    {receipt.payments.map(
                      (
                        payment: any,
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="
                            flex
                            items-center
                            justify-between
                            text-sm
                          "
                        >
                          <div>
                            <p className="font-bold">
                              ₦
                              {
                                payment.amount
                              }
                            </p>

                            <p className="text-zinc-500">
                              {
                                payment.payment_method
                              }
                            </p>
                          </div>

                          <p className="text-right text-zinc-500">
                            {new Date(
                              payment.created_at
                            ).toLocaleString()}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* FOOTER */}

              <div
                className="
                  mt-10
                  border-t
                  border-dashed
                  pt-6
                  text-center
                "
              >
                <h2
                  className="
                    text-3xl
                    font-black
                  "
                >
                  THANK YOU
                </h2>

                <p
                  className="
                    mt-2
                    text-zinc-500
                  "
                >
                  Powered by Kitchen POS
                </p>
              </div>
            </div>
          </div>

          {/* ACTIONS */}

          <div
            id="receipt-actions"
            className="
              mt-6
              flex
              gap-3
            "
          >
            <button
              onClick={
                handlePrint
              }
              className="
                h-14
                flex-1
                rounded-2xl
                bg-black
                font-bold
                text-white
              "
            >
              Print Receipt
            </button>

            <button
              onClick={onClose}
              className="
                h-14
                flex-1
                rounded-2xl
                border
                border-zinc-300
                font-bold
              "
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}