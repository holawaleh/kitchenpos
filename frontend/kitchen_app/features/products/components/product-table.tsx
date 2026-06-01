import Image from "next/image";

import {
  Product,
} from "../types/product.types";

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({
  products,
}: ProductTableProps) {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl border
      "
      style={{
        borderColor:
          "var(--sidebar-border)",
      }}
    >
      <table className="w-full">
        <thead
          style={{
            background:
              "var(--card)",
          }}
        >
          <tr>
            <th className="p-4 text-left">
              Image
            </th>

            <th className="p-4 text-left">
              Product
            </th>

            <th className="p-4 text-left">
              Barcode
            </th>

            <th className="p-4 text-left">
              Menu
            </th>

            <th className="p-4 text-left">
              Price
            </th>

            <th className="p-4 text-left">
              Type
            </th>

            <th className="p-4 text-left">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map(
            (product) => (
              <tr
                key={product.id}
                className="border-t"
                style={{
                  borderColor:
                    "var(--sidebar-border)",
                }}
              >
                <td className="p-4">
                  {product.image ? (
                    <Image
                      src={
                        product.image
                      }
                      alt={
                        product.name
                      }
                      width={50}
                      height={50}
                      className="
                        rounded-lg
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex h-12 w-12
                        items-center
                        justify-center
                        rounded-lg
                        bg-gray-200
                        text-xs
                      "
                    >
                      No Image
                    </div>
                  )}
                </td>

                <td className="p-4">
                  {product.name}
                </td>

                <td className="p-4">
                  {
                    product.barcode
                  }
                </td>

                <td className="p-4">
                  {
                    product.menu
                      ?.name
                  }
                </td>

                <td className="p-4">
                  ₦
                  {
                    product.default_price
                  }
                </td>

                <td className="p-4">
                  {
                    product.product_type
                  }
                </td>

                <td className="p-4">
                  <span
                    className="
                      rounded-full
                      px-3 py-1
                      text-xs font-semibold
                    "
                    style={{
                      background:
                        product.status ===
                        "AVAILABLE"
                          ? "#DCFCE7"
                          : "#FEE2E2",

                      color:
                        product.status ===
                        "AVAILABLE"
                          ? "#166534"
                          : "#991B1B",
                    }}
                  >
                    {
                      product.status
                    }
                  </span>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}