import { useEffect, useState } from "react"
import {
  useFieldArray,
  useForm,
} from "react-hook-form"
import {
  Link,
  useNavigate,
  useParams,
} from "react-router"
import { api } from "../../services/axiosInstance"
import Loading from "../../components/Loading"

type Size =
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL"

export interface ProductFormData {
  title: string
  description: string
  amount: number
  currency: "INR" | "USD"
  category: "clothing" | "general"
  stock: number
  sizes: {
    size: Size
    stock: number
  }[]
}

interface ImageItem {
  id: string
  source: string
  file?: File
}

interface ProductResponse {
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
}

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const isEdit = Boolean(id)

  const {
    register,
    control,
    watch,
    reset,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
      currency: "INR",
      category: "general",
      stock: 0,
      sizes: [
        {
          size: "M",
          stock: 0,
        },
      ],
    },
  })

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "sizes",
  })

  const category = watch("category")

  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [pageError, setPageError] = useState("")

  useEffect(() => {
    if (!isEdit || !id) {
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setPageError("")

        const response = await api.get(`/api/products/${id}`)

        const product: ProductResponse =
          response.data.product || response.data

        reset({
          title: product.title,
          description: product.description,
          amount: product.price.amount,
          currency: product.price.currency,
          category: product.category,
          stock: product.stock ?? 0,
          sizes:
            product.sizes?.map((item) => ({
              size: item.size,
              stock: item.stock,
            })) || [
              {
                size: "M",
                stock: 0,
              },
            ],
        })

        setImages(
          product.images.map((image, index) => ({
            id: `${product._id}-${index}`,
            source: image,
          }))
        )
      } catch (error: any) {
        console.log(error)

        setPageError(
          error?.response?.data?.message ||
            "Failed to load product"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, isEdit, reset])

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || [])

    if (!files.length) return

    const availableSlots = 3 - images.length

    if (availableSlots <= 0) {
      event.target.value = ""
      return
    }

    const selectedFiles = files.slice(0, availableSlots)

    const newImages: ImageItem[] = selectedFiles.map(
      (file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        source: URL.createObjectURL(file),
        file,
      })
    )

    setImages((prev) => [...prev, ...newImages])

    event.target.value = ""
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const image = prev.find(
        (item) => item.id === id
      )

      if (image?.file) {
        URL.revokeObjectURL(image.source)
      }

      return prev.filter((item) => item.id !== id)
    })
  }

  const onSubmit = async (data: ProductFormData) => {
    if (data.category === "clothing") {
        const sizesUsed = data.sizes.map((s) => s.size)
        const hasDuplicates = new Set(sizesUsed).size !== sizesUsed.length
        if (hasDuplicates) {
            setPageError("Each size can only be added once. Please remove the duplicate.")
            return
        }
    }
    try {
      setSubmitting(true)
      setPageError("")

      const formData = new FormData()

      formData.append("title", data.title)
      formData.append("description", data.description)

      formData.append(
        "price",
        JSON.stringify({
          amount: data.amount,
          currency: data.currency,
        })
      )

      formData.append("category", data.category)

      if (data.category === "general") {
        formData.append(
          "stock",
          String(data.stock)
        )
      }

      if (data.category === "clothing") {
        formData.append(
          "sizes",
          JSON.stringify(data.sizes)
        )
      }

      images.forEach((image) => {
        if (image.file) {
          formData.append("images", image.file)
        }
      })

      if (isEdit) {
        await api.put(
          `/api/products/${id}`,
          formData
        )
      } else {
        const hasNewImage = images.some(
          (image) => image.file
        )

        if (!hasNewImage) {
          setPageError(
            "At least one image is required"
          )
          setSubmitting(false)
          return
        }

        await api.post(
          "/api/products",
          formData
        )
      }

      navigate("/main/my-products")
    } catch (error: any) {
      console.log(error)

      const backendErrors = error?.response?.data?.errors

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        const fieldMap: Record<string, keyof ProductFormData> = {
          "price.amount": "amount",
          "price.currency": "currency",
        }

        backendErrors.forEach((err: { path?: string; param?: string; msg: string }) => {
          const rawField = err.path ?? err.param ?? ""
          const fieldName = fieldMap[rawField] ?? (rawField as keyof ProductFormData)

          const isMappableTopLevelField =
            fieldName &&
            !fieldName.toString().includes(".") &&
            !fieldName.toString().startsWith("sizes") &&
            fieldName in { title: 0, description: 0, amount: 0, currency: 0, category: 0, stock: 0 }

          if (isMappableTopLevelField) {
            setFormError(fieldName, { type: "server", message: err.msg })
          }
        })

        setPageError(backendErrors[0]?.msg || "Please fix the errors below")
      } else {
        setPageError(
          error?.response?.data?.message ||
            "Something went wrong. Please try again."
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div className="mb-10">
        <Link
          to="/main/my-products"
          className="text-sm text-stone-500 transition hover:text-[#183c32]"
        >
          ← Back to my products
        </Link>

        <p className="mt-7 text-sm font-medium text-[#537466]">
          Seller dashboard
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#183c32]">
          {isEdit
            ? "Edit product"
            : "Create a product"}
        </h1>

        <p className="mt-3 text-sm text-stone-500">
          {isEdit
            ? "Update your product information and stock."
            : "Add a new product to your marketplace listing."}
        </p>
      </div>

      {pageError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {pageError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Images */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-semibold text-[#1d2925]">
            Product images
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Add up to three images.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-xl bg-[#eeeae1]"
              >
                <img
                  src={image.source}
                  alt="Product preview"
                  className="h-44 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeImage(image.id)
                  }
                  className="absolute right-2 top-2 rounded-full bg-black/70 px-2.5 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
                >
                  Remove
                </button>
              </div>
            ))}

            {images.length < 3 && (
              <label className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-[#faf9f6] text-center transition hover:border-[#183c32]">
                <span className="text-2xl text-stone-400">
                  +
                </span>

                <span className="mt-2 text-sm font-medium text-stone-600">
                  Add image
                </span>

                <span className="mt-1 text-xs text-stone-400">
                  {3 - images.length} remaining
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Basic information */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-semibold text-[#1d2925]">
            Basic information
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Product title
              </label>

              <input
                {...register("title", {
                  required:
                    "Product title is required",
                })}
                placeholder="e.g. Classic Oversized Shirt"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#183c32] focus:ring-2 focus:ring-[#183c32]/10"
              />

              {errors.title && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                {...register("description", {
                  required:
                    "Description is required",
                })}
                rows={5}
                placeholder="Describe the product..."
                className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#183c32] focus:ring-2 focus:ring-[#183c32]/10"
              />

              {errors.description && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("amount", {
                    required: "Price is required",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message:
                        "Price cannot be negative",
                    },
                  })}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#183c32] focus:ring-2 focus:ring-[#183c32]/10"
                />

                {errors.amount && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Currency
                </label>

                <select
                  {...register("currency")}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#183c32]"
                >
                  <option value="INR">
                    INR — ₹
                  </option>

                  <option value="USD">
                    USD — $
                  </option>
                </select>

                {errors.currency && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.currency.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Category
              </label>

              <select
                {...register("category")}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#183c32]"
              >
                <option value="general">
                  General
                </option>

                <option value="clothing">
                  Clothing
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-semibold text-[#1d2925]">
            Inventory
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            {category === "clothing"
              ? "Set stock separately for each available size."
              : "Set the total available stock."}
          </p>

          {category === "general" ? (
            <div className="mt-6 max-w-sm">
              <label className="mb-2 block text-sm font-medium">
                Stock quantity
              </label>

              <input
                type="number"
                min="0"
                {...register("stock", {
                  required: "Stock is required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message:
                      "Stock cannot be negative",
                  },
                })}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#183c32] focus:ring-2 focus:ring-[#183c32]/10"
              />

              {errors.stock && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.stock.message}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_1fr_auto] gap-3"
                >
                  <select
                    {...register(
                      `sizes.${index}.size`
                    )}
                    className="min-w-0 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#183c32]"
                  >
                    <option value="XS">
                      XS
                    </option>

                    <option value="S">
                      S
                    </option>

                    <option value="M">
                      M
                    </option>

                    <option value="L">
                      L
                    </option>

                    <option value="XL">
                      XL
                    </option>

                    <option value="XXL">
                      XXL
                    </option>
                  </select>

                  <input
                    type="number"
                    min="0"
                    {...register(
                      `sizes.${index}.stock`,
                      {
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message:
                            "Stock cannot be negative",
                        },
                      }
                    )}
                    placeholder="Stock"
                    className="min-w-0 rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#183c32] focus:ring-2 focus:ring-[#183c32]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      remove(index)
                    }
                    disabled={fields.length === 1}
                    className="rounded-xl border border-stone-300 px-3 text-sm text-stone-500 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 sm:px-4"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  append({
                    size: "M",
                    stock: 0,
                  })
                }
                className="mt-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-medium text-[#183c32] transition hover:border-[#183c32]"
              >
                + Add size
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              navigate("/main/my-products")
            }
            disabled={submitting}
            className="rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-[#183c32] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#102e27] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save changes"
                : "Create product"}
          </button>
        </div>
      </form>
    </section>
  )
}

export default ProductForm