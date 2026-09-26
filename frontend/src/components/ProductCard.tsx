import { Link } from "react-router"
import type { Product } from "../types/product.types"

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const availableStock =
    product.category === "general"
      ? product.stock || 0
      : product.sizes?.reduce(
          (total, item) => total + item.stock,
          0
        ) || 0

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#eeeae1]">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-[380px] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />

        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium capitalize text-[#183c32] backdrop-blur">
          {product.category}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-medium text-[#1d2925]">
              {product.title}
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              {product.seller.name}
            </p>
          </div>

          <p className="shrink-0 font-semibold text-[#183c32]">
            {product.price.currency === "INR" ? "₹" : "$"}
            {product.price.amount.toLocaleString(
              product.price.currency === "INR"
                ? "en-IN"
                : "en-US"
            )}
          </p>
        </div>

        <p className="mt-3 text-xs text-stone-400">
          {availableStock > 0
            ? `${availableStock} available`
            : "Out of stock"}
        </p>
      </div>
    </Link>
  )
}

export default ProductCard