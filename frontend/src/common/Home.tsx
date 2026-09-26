import { useEffect, useState } from "react"
import { Link } from "react-router"
import type { Product } from "../types/product.types"
import { api } from "../services/axiosInstance"

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const getFeaturedProducts = async () => {
    try {
      const res = await api.get("/api/products/")
      setFeaturedProducts((res.data.products as Product[]).slice(0, 3))
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getFeaturedProducts()
  }, [])

  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 lg:px-10 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#537466]">
              A better way to shop
            </p>

            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#183c32] sm:text-6xl lg:text-7xl">
              Find things worth keeping.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-stone-500 sm:text-lg">
              Discover products from independent sellers and small brands,
              all in one simple marketplace.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/browse"
                className="rounded-full bg-[#183c32] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#102e27]"
              >
                Browse products
              </Link>

              <Link
                to="/register"
                className="rounded-full border border-stone-300 bg-white px-6 py-3.5 text-sm font-medium text-[#1d2925] transition hover:border-[#183c32]"
              >
                Start selling
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] bg-[#e7e1d5]">
              {!loading && featuredProducts[0] ? (
                <img
                  src={featuredProducts[0].images[0]}
                  alt={featuredProducts[0].title}
                  className="h-[520px] w-full object-cover"
                />
              ) : (
                <div className="h-[520px] w-full" />
              )}
            </div>

            {!loading && featuredProducts[0] && (
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/50 bg-white/90 p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-500">Featured</p>
                    <p className="mt-1 text-sm font-semibold text-[#1d2925]">
                      {featuredProducts[0].title}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-[#183c32]">
                    ₹{featuredProducts[0].price.amount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-[#f3f1eb]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Discover",
                text: "Search through products from independent sellers.",
              },
              {
                number: "02",
                title: "Choose",
                text: "Compare products, prices and available stock.",
              },
              {
                number: "03",
                title: "Support",
                text: "Buy from sellers building something of their own.",
              },
            ].map((item) => (
              <div key={item.number}>
                <p className="text-sm font-semibold text-[#779184]">
                  {item.number}
                </p>

                <h2 className="mt-4 text-xl font-semibold text-[#1d2925]">
                  {item.title}
                </h2>

                <p className="mt-2 max-w-xs text-sm leading-6 text-stone-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="mb-9 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#537466]">
              Fresh finds
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#1d2925]">
              Recently added
            </h2>
          </div>

          <Link
            to="/browse"
            className="hidden text-sm font-medium text-[#183c32] sm:block"
          >
            View all →
          </Link>
        </div>

        {!loading && featuredProducts.length === 0 ? (
          <p className="text-sm text-stone-500">No products yet — check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="group"
              >
                <div className="overflow-hidden rounded-2xl bg-[#eeeae1]">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-80 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="mt-4 flex justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-[#1d2925]">
                      {product.title}
                    </h3>

                    <p className="mt-1 text-sm text-stone-500">
                      {product.seller.name}
                    </p>
                  </div>

                  <p className="font-semibold text-[#183c32]">
                    ₹{product.price.amount.toLocaleString("en-IN")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home