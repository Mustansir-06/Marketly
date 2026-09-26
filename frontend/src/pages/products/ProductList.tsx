import { useEffect, useState } from "react"
import ProductCard from "../../components/ProductCard"
import Pagination from "../../components/Pagination"
import { api } from "../../services/axiosInstance"
import type { Product } from "../../types/product.types" 
interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}
const ProductList = () => {
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [order, setOrder] = useState("desc")
  const [page, setPage] = useState(1)
  const [products,setProducts]=useState<Product[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const getAllProducts=async()=>{
    try {
      const res=await api.get("/api/products/",{
        params:{search,sortBy,order,page,limit:10}
      })
      setProducts(res.data.products)
      setPagination(res.data.pagination) 
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    getAllProducts()
  },[search,sortBy,order,page])
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium text-[#537466]">
          Marketplace
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#183c32]">
          Browse products
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-stone-500">
          Discover products from independent sellers and small
          brands.
        </p>
      </div>

      {/* Search + Sort */}
      <div className="mb-9 flex flex-col gap-3 md:flex-row">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="Search products..."
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#183c32] focus:ring-2 focus:ring-[#183c32]/10"
        />

        <select
          value={`${sortBy}-${order}`}
          onChange={(e) => {
            const [newSortBy, newOrder] =
              e.target.value.split("-")

            setSortBy(newSortBy)
            setOrder(newOrder)
            setPage(1)
          }}
          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-[#183c32]"
        >
          <option value="createdAt-desc">
            Newest
          </option>

          <option value="createdAt-asc">
            Oldest
          </option>

          <option value="price-asc">
            Price: Low to high
          </option>

          <option value="price-desc">
            Price: High to low
          </option>
        </select>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-20 text-center">
          <h2 className="text-lg font-semibold text-[#1d2925]">
            No products found
          </h2>

          <p className="mt-2 text-sm text-stone-500">
            Try changing your search or sorting options.
          </p>
        </div>
      )}

      {pagination && (
          <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
          />
      )}
    </section>
  )
}

export default ProductList