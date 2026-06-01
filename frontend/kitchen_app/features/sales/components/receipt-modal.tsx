"use client";

interface Props {
  open: boolean;

  onClose: () => void;

  receipt: any;
}

function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export function ReceiptModal({ open, onClose, receipt }: Props) {
  if (!open || !receipt) {
    return null;
  }

  const balance = Math.max(Number(receipt.balance || 0), 0);

  const paidAmount = Number(receipt.paid_amount || receipt.amount_paid || 0);

  const change = Math.max(paidAmount - Number(receipt.total_amount || 0), 0);

  const customerSummary = receipt.customer_payment_summary;

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

      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-[24px] bg-white p-6">
          <div className="max-h-[80vh] overflow-y-auto pr-2">
            <div id="receipt-print" className="text-zinc-900">
              <div className="text-center">
                <h1 className="text-3xl font-semibold">Kitchen POS</h1>

                <p className="mt-2 text-xs font-medium tracking-[0.22em] text-zinc-500">
                  RESTAURANT RECEIPT
                </p>
              </div>

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">Receipt</span>
                  <span className="text-right font-medium">
                    {receipt.receipt_number}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">Cashier</span>
                  <span className="text-right font-medium">
                    {receipt.cashier_name}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">Customer</span>
                  <span className="text-right font-medium">
                    {receipt.customer_name || "Walk-in"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">Method</span>
                  <span className="text-right font-medium">
                    {receipt.payment_method}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">Status</span>
                  <span className="text-right font-medium">
                    {receipt.payment_status}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">Date</span>
                  <span className="text-right font-medium">
                    {new Date(receipt.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-dashed pt-5">
                <div className="mb-3 grid grid-cols-4 text-xs font-medium text-zinc-500">
                  <span>ITEM</span>
                  <span>QTY</span>
                  <span>PRICE</span>
                  <span className="text-right">TOTAL</span>
                </div>

                <div className="space-y-3">
                  {receipt.items?.map((item: any, index: number) => (
                    <div key={index} className="grid grid-cols-4 text-sm">
                      <span>{item.product_name}</span>
                      <span>{item.quantity}</span>
                      <span>{formatCurrency(item.unit_price)}</span>
                      <span className="text-right font-medium">
                        {formatCurrency(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-dashed pt-5">
                <div className="flex justify-between text-xl font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(receipt.total_amount)}</span>
                </div>

                <div className="flex justify-between text-base font-medium text-emerald-700">
                  <span>Paid</span>
                  <span>{formatCurrency(paidAmount)}</span>
                </div>

                {change > 0 ? (
                  <div className="flex justify-between text-base font-medium text-blue-700">
                    <span>Change</span>
                    <span>{formatCurrency(change)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-base font-medium text-red-600">
                    <span>Balance</span>
                    <span>{formatCurrency(balance)}</span>
                  </div>
                )}
              </div>

              {customerSummary && (
                <div className="mt-6 border-t border-dashed pt-5">
                  <h3 className="mb-3 text-xs font-semibold tracking-[0.18em] text-zinc-500">
                    CUSTOMER SUMMARY
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500">Sales</span>
                      <span className="font-medium">
                        {customerSummary.sale_count}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500">Total purchases</span>
                      <span className="font-medium">
                        {formatCurrency(customerSummary.total_amount)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500">Total paid</span>
                      <span className="font-medium text-emerald-700">
                        {formatCurrency(customerSummary.paid_amount)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500">Outstanding</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(customerSummary.outstanding_balance)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {receipt.payments?.length > 0 && (
                <div className="mt-6 border-t border-dashed pt-5">
                  <h3 className="mb-3 text-xs font-semibold tracking-[0.18em] text-zinc-500">
                    PAYMENTS
                  </h3>

                  <div className="space-y-4">
                    {receipt.payments.map((payment: any, index: number) => (
                      <div
                        key={payment.id || index}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <div>
                          <p className="font-medium">
                            {formatCurrency(payment.amount)}
                          </p>

                          <p className="text-zinc-500">
                            {payment.payment_method} -{" "}
                            {payment.payment_type === "REPAYMENT"
                              ? `Repayment ${payment.sequence_number || ""}`
                              : "Initial"}
                          </p>

                          {payment.reference && (
                            <p className="text-xs text-zinc-400">
                              Ref: {payment.reference}
                            </p>
                          )}
                        </div>

                        <p className="text-right text-xs text-zinc-500">
                          {new Date(payment.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 border-t border-dashed pt-5 text-center">
                <h2 className="text-xl font-semibold">Thank you</h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Powered by Kitchen POS
                </p>
              </div>
            </div>
          </div>

          <div id="receipt-actions" className="mt-6 flex gap-3">
            <button
              onClick={handlePrint}
              className="h-14 flex-1 rounded-2xl bg-black font-semibold text-white"
            >
              Print Receipt
            </button>

            <button
              onClick={onClose}
              className="h-14 flex-1 rounded-2xl border border-zinc-300 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
