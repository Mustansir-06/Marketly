import { Link } from "react-router"
import { useEffect, useState } from "react"
import { api } from "../../services/axiosInstance"
import Pagination from "../../components/Pagination"

interface Product {
  _id: string
  title: string
  description: string
  images: string[]
  price: { amount: number; currency: "INR" | "USD" }
  category: "clothing" | "general"
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

const MyProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getMyProducts = async (pageToFetch: number) => {
    try {
      setLoading(true)
      setError("")
      const res = await api.get("/api/products/my-products", {
        params: { page: pageToFetch, limit: 10 },
      })
      setProducts(res.data.products)
      setPagination(res.data.pagination)
    } catch (error: any) {
      console.log(error)
      setError(error?.response?.data?.message || "Failed to load your products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMyProducts(page)
  }, [page])

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?")
    if (!confirmed) return

    try {
      setDeletingId(id)
      await api.delete(`/api/products/${id}`)
      if (products.length === 1 && page > 1) {
        setPage((prev) => prev - 1)
      } else {
        getMyProducts(page)
      }
    } catch (error: any) {
      console.log(error)
      alert(error?.response?.data?.message || "Failed to delete product")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-[#537466]">Seller dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#183c32]">My products</h1>
          <p className="mt-3 text-sm text-stone-500">Manage your marketplace listings.</p>
        </div>

        <Link
          to="/main/products/new"
          className="rounded-xl bg-[#183c32] px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-[#102e27]"
        >
          + Add product
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-20 text-center text-sm text-stone-500">
          Loading your products...
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="hidden grid-cols-[2fr_1fr_1fr_auto] gap-5 border-b border-stone-200 bg-[#f7f5f0] px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500 md:grid">
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-stone-200">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="grid gap-4 px-5 py-5 md:grid-cols-[2fr_1fr_1fr_auto] md:items-center md:gap-5"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div>
                      <h2 className="font-medium text-[#1d2925]">{product.title}</h2>
                      <p className="mt-1 text-xs text-stone-500">Listed by you</p>
                    </div>
                  </div>

                  <div className="text-sm capitalize text-stone-500">{product.category}</div>

                  <div className="font-medium text-[#183c32]">
                    {product.price.currency === "INR" ? "₹" : "$"}
                    {product.price.amount.toLocaleString("en-IN")}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/main/products/${product._id}/edit`}
                      className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-stone-600 transition hover:border-[#183c32] hover:text-[#183c32]"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deletingId === product._id}
                      className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-stone-600 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === product._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-20 text-center">
          <h2 className="text-lg font-semibold">No products yet</h2>
          <p className="mt-2 text-sm text-stone-500">Create your first listing to get started.</p>
          <Link
            to="/main/products/new"
            className="mt-5 inline-block rounded-xl bg-[#183c32] px-5 py-3 text-sm font-medium text-white"
          >
            Create product
          </Link>
        </div>
      )}
    </section>
  )
}

export default MyProducts