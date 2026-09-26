import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { api } from "../../services/axiosInstance"
import Loading from "../../components/Loading"

type Size =
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL"

interface Product {
  _id: string
  title: string
  description: string
  images: string[]
  price: {
    amount: number
    currency: "INR" | "USD"
  }
  category: "clothing" | "general"
  stock?: number
  sizes?: {
    size: Size
    stock: number
  }[]
  seller: string
}

interface CartItem {
  _id: string
  product: Product
  quantity: number
  size?: Size
}

interface CartResponse {
  user: string
  items: CartItem[]
}

const Cart = () => {
  const [cart, setCart] = useState<CartResponse | null>(null)

  const [loading, setLoading] = useState(true)
  const [updatingItem, setUpdatingItem] = useState("")
  const [removingItem, setRemovingItem] = useState("")
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const fetchCart = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await api.get("/api/cart")

      setCart(response.data.cart)
    } catch (error: any) {
      console.log(error)

      setError(
        error?.response?.data?.message ||
          "Failed to load your cart."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const updateQuantity = async (
    itemId: string,
    quantity: number
  ) => {
    if (quantity < 1) return

    try {
      setUpdatingItem(itemId)
      setError("")

      const response = await api.put(
        `/api/cart/items/${itemId}`,
        {
          quantity,
        }
      )

      setCart(response.data.cart)
    } catch (error: any) {
      console.log(error)

      setError(
        error?.response?.data?.message ||
          "Failed to update cart."
      )
    } finally {
      setUpdatingItem("")
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      setRemovingItem(itemId)
      setError("")

      const response = await api.delete(
        `/api/cart/items/${itemId}`
      )

      setCart(response.data.cart)
    } catch (error: any) {
      console.log(error)

      setError(
        error?.response?.data?.message ||
          "Failed to remove item."
      )
    } finally {
      setRemovingItem("")
    }
  }

  const checkout = async () => {
    try {
      setCheckingOut(true)
      setError("")

      await api.post("/api/cart/checkout")
      navigate("/main/checkout/success")
    } catch (error: any) {
      console.log(error)

      setError(
        error?.response?.data?.message ||
          "Checkout failed. Please try again."
      )
    } finally {
      setCheckingOut(false)
    }
  }

  const items = cart?.items || []

  const validItems = items.filter(
    (item) =>
      item.product &&
      item.product.price &&
      item.product.images
  )

  const subtotal = validItems.reduce(
    (total, item) =>
      total +
      item.product.price.amount * item.quantity,
    0
  )

  const currency =
    validItems[0]?.product.price.currency || "INR"

  const formatPrice = (
    amount: number,
    currency: "INR" | "USD"
  ) => {
    return amount.toLocaleString(
      currency === "INR" ? "en-IN" : "en-US"
    )
  }

  if (loading) {
    return <Loading />
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium text-[#537466]">
          Your selection
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#183c32] sm:text-5xl">
          Shopping cart
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-stone-500">
          Review the products you've selected before
          checking out.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty cart */}
      {validItems.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eeeae1] text-2xl">
            🛍
          </div>

          <h2 className="mt-6 text-xl font-semibold text-[#1d2925]">
            Your cart is empty
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
            Looks like you haven't added anything yet.
            Explore the store and find something you'll
            love.
          </p>

          <Link
            to="/browse"
            className="mt-7 inline-flex rounded-xl bg-[#183c32] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#102e27]"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Cart items */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1d2925]">
                Cart items
              </h2>

              <span className="text-sm text-stone-500">
                {validItems.length}{" "}
                {validItems.length === 1
                  ? "item"
                  : "items"}
              </span>
            </div>

            <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
              {validItems.map((item) => {
                const product = item.product

                const itemTotal =
                  product.price.amount *
                  item.quantity

                return (
                  <div
                    key={item._id}
                    className="p-5 sm:p-6"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* Image */}
                      <Link
                        to={`/products/${product._id}`}
                        className="shrink-0"
                      >
                        <div className="h-28 w-24 overflow-hidden rounded-xl bg-[#eeeae1] sm:h-32 sm:w-28">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                          />
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <Link
                              to={`/products/${product._id}`}
                              className="font-medium text-[#1d2925] transition hover:text-[#183c32]"
                            >
                              {product.title}
                            </Link>

                            <p className="mt-1 text-xs capitalize text-stone-400">
                              {product.category}
                            </p>

                            {item.size && (
                              <p className="mt-2 text-sm text-stone-500">
                                Size:{" "}
                                <span className="font-medium text-[#1d2925]">
                                  {item.size}
                                </span>
                              </p>
                            )}
                          </div>

                          <p className="shrink-0 font-semibold text-[#183c32]">
                            {product.price.currency ===
                            "INR"
                              ? "₹"
                              : "$"}

                            {formatPrice(
                              itemTotal,
                              product.price.currency
                            )}
                          </p>
                        </div>

                        {/* Bottom row */}
                        <div className="mt-6 flex items-center justify-between gap-4">
                          {/* Quantity */}
                          <div className="flex items-center rounded-xl border border-stone-300">
                            <button
                              type="button"
                              disabled={
                                updatingItem ===
                                  item._id ||
                                item.quantity <= 1
                              }
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.quantity - 1
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-stone-500 transition hover:text-[#183c32] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              −
                            </button>

                            <span className="w-9 text-center text-sm font-medium text-[#1d2925]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              disabled={
                                updatingItem ===
                                item._id
                              }
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.quantity + 1
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-stone-500 transition hover:text-[#183c32] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              +
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            disabled={
                              removingItem ===
                              item._id
                            }
                            onClick={() =>
                              removeItem(item._id)
                            }
                            className="text-sm text-stone-400 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {removingItem ===
                            item._id
                              ? "Removing..."
                              : "Remove"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
              <h2 className="text-lg font-semibold text-[#1d2925]">
                Order summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-[#1d2925]">
                    {currency === "INR"
                      ? "₹"
                      : "$"}

                    {formatPrice(
                      subtotal,
                      currency
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">
                    Shipping
                  </span>

                  <span className="font-medium text-[#183c32]">
                    Free
                  </span>
                </div>

                <div className="border-t border-stone-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#1d2925]">
                      Total
                    </span>

                    <span className="text-xl font-semibold text-[#183c32]">
                      {currency === "INR"
                        ? "₹"
                        : "$"}

                      {formatPrice(
                        subtotal,
                        currency
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={checkout}
                disabled={checkingOut}
                className="mt-7 w-full rounded-xl bg-[#183c32] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#102e27] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkingOut
                  ? "Processing..."
                  : "Checkout"}
              </button>

              <Link
                to="/browse"
                className="mt-3 block text-center text-sm text-stone-500 transition hover:text-[#183c32]"
              >
                Continue shopping
              </Link>
            </div>

            <div className="mt-4 rounded-xl bg-[#eeeae1] px-5 py-4">
              <p className="text-xs leading-5 text-stone-600">
                Stock is verified again when you
                checkout. If an item is no longer
                available, you'll see an appropriate
                message before your order is completed.
              </p>
            </div>
          </aside>
        </div>
      )}
    </section>
  )
}

export default Cart