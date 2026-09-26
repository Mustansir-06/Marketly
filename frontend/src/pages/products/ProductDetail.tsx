import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { api } from "../../services/axiosInstance"
import type { Product } from "../../types/product.types"

type Size =
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL"

const ProductDetail = () => {
  const { id } = useParams()

  const [product, setProduct] =
    useState<Product | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] =
    useState(0)

  const [selectedSize, setSelectedSize] =
    useState<Size | undefined>()

  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] =
    useState(false)

  const [cartMessage, setCartMessage] =
    useState("")

  const getProduct = async () => {
    try {
      setLoading(true)
      setError("")

      const res = await api.get(
        `/api/products/${id}`
      )

      setProduct(res.data.product)
    } catch (error: any) {
      console.log(error)

      setError(
        error?.response?.data?.message ||
          "Failed to load product"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProduct()
  }, [id])

  const selectedSizeStock =
    product?.category === "clothing"
      ? product.sizes?.find(
          (item) => item.size === selectedSize
        )?.stock || 0
      : product?.stock || 0

  const availableStock = selectedSizeStock

  const increaseQuantity = () => {
    if (quantity < availableStock) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleSizeSelect = (size: Size) => {
    setSelectedSize(size)
    setQuantity(1)
    setCartMessage("")
    setError("")
  }

  const handleAddToCart = async () => {
    if (!product) return

    if (
      product.category === "clothing" &&
      !selectedSize
    ) {
      setCartMessage("Please select a size")
      return
    }

    if (availableStock < quantity) {
      setCartMessage("Not enough stock available")
      return
    }

    try {
      setAddingToCart(true)
      setError("")
      setCartMessage("")

      await api.post("/api/cart/items", {
        productId: product._id,
        quantity,
        ...(product.category === "clothing" &&
        selectedSize
          ? { size: selectedSize }
          : {}),
      })

      setCartMessage("Added to cart successfully")
    } catch (error: any) {
      console.log(error)

      setCartMessage(
        error?.response?.data?.message ||
          "Failed to add product to cart"
      )
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center text-sm text-stone-500">
        Loading product...
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center">
        <h1 className="text-3xl font-semibold text-[#183c32]">
          Product not found
        </h1>

        {error && (
          <p className="mt-2 text-sm text-stone-500">
            {error}
          </p>
        )}

        <Link
          to="/browse"
          className="mt-5 inline-block text-sm font-medium text-[#183c32] underline"
        >
          Back to products
        </Link>
      </div>
    )
  }

  const isOutOfStock =
    product.category === "general"
      ? !product.stock
      : product.sizes?.every(
          (item) => item.stock === 0
        )

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <Link
        to="/browse"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition hover:text-[#183c32]"
      >
        ← Back to products
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* Images */}
        <div>
          <div className="overflow-hidden rounded-2xl bg-[#eeeae1]">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="h-[520px] w-full object-cover sm:h-[650px]"
            />
          </div>

          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map(
                (image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() =>
                      setSelectedImage(index)
                    }
                    className={`overflow-hidden rounded-xl border-2 ${
                      selectedImage === index
                        ? "border-[#183c32]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${
                        index + 1
                      }`}
                      className="h-20 w-20 object-cover"
                    />
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Product information */}
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium capitalize text-[#537466]">
            {product.category}
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#183c32] sm:text-5xl">
            {product.title}
          </h1>

          <p className="mt-5 text-2xl font-semibold text-[#1d2925]">
            {product.price.currency === "INR"
              ? "₹"
              : "$"}

            {product.price.amount.toLocaleString(
              product.price.currency === "INR"
                ? "en-IN"
                : "en-US"
            )}
          </p>

          <div className="my-8 border-t border-stone-200" />

          <p className="text-sm leading-7 text-stone-500">
            {product.description}
          </p>

          <div className="mt-8">
            <p className="text-sm font-semibold text-[#1d2925]">
              Sold by
            </p>

            <p className="mt-2 text-sm text-stone-500">
              {product.seller.name}
            </p>
          </div>

          {/* Clothing sizes */}
          {product.category === "clothing" &&
            product.sizes && (
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#1d2925]">
                    Select size
                  </p>

                  <span className="text-xs text-stone-400">
                    {selectedSize
                      ? `Selected: ${selectedSize}`
                      : "Choose your size"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((item) => {
                    const isSelected =
                      selectedSize === item.size

                    const isUnavailable =
                      item.stock === 0

                    return (
                      <button
                        key={item.size}
                        type="button"
                        disabled={isUnavailable}
                        onClick={() =>
                          handleSizeSelect(
                            item.size
                          )
                        }
                        className={`relative flex h-14 min-w-14 flex-col items-center justify-center rounded-lg border px-3 text-sm font-medium transition ${
                          isUnavailable
                            ? "cursor-not-allowed border-stone-200 text-stone-300 line-through"
                            : isSelected
                              ? "border-[#183c32] bg-[#183c32] text-white"
                              : "border-stone-300 text-[#1d2925] hover:border-[#183c32] hover:bg-[#f3f1eb]"
                        }`}
                      >
                        <span>
                          {item.size}
                        </span>

                        <span
                          className={`text-[10px] font-normal ${
                            isSelected
                              ? "text-white/70"
                              : "text-stone-400"
                          }`}
                        >
                          {isUnavailable
                            ? "Out of stock"
                            : `${item.stock} left`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

          {/* General stock */}
          {product.category === "general" && (
            <div className="mt-8 rounded-xl bg-[#f3f1eb] px-4 py-3">
              <p className="text-sm text-stone-600">
                <span className="font-semibold text-[#1d2925]">
                  {product.stock}
                </span>{" "}
                units currently available
              </p>
            </div>
          )}

          {/* Quantity */}
          {!isOutOfStock &&
            (product.category === "general" ||
              selectedSize) && (
              <div className="mt-8">
                <p className="mb-3 text-sm font-semibold text-[#1d2925]">
                  Quantity
                </p>

                <div className="flex w-fit items-center rounded-xl border border-stone-300">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="flex h-11 w-11 items-center justify-center text-lg text-stone-500 transition hover:text-[#183c32] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    −
                  </button>

                  <span className="flex h-11 w-12 items-center justify-center border-x border-stone-300 text-sm font-medium text-[#1d2925]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={
                      quantity >= availableStock
                    }
                    className="flex h-11 w-11 items-center justify-center text-lg text-stone-500 transition hover:text-[#183c32] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <p className="mt-2 text-xs text-stone-400">
                  {availableStock} available
                </p>
              </div>
            )}

          {/* Cart message */}
          {cartMessage && (
            <div className="mt-6 rounded-xl border border-[#b8cec5] bg-[#edf4f1] px-4 py-3 text-sm text-[#183c32]">
              {cartMessage}
            </div>
          )}

          {/* Product loading error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              addingToCart ||
              Boolean(isOutOfStock) ||
              (product.category === "clothing" &&
                !selectedSize)
            }
            className="mt-6 w-full rounded-xl bg-[#183c32] py-4 text-sm font-medium text-white transition hover:bg-[#102e27] disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {addingToCart
              ? "Adding..."
              : isOutOfStock
                ? "Out of stock"
                : product.category ===
                    "clothing" &&
                  !selectedSize
                  ? "Select a size"
                  : "Add to cart"}
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductDetail