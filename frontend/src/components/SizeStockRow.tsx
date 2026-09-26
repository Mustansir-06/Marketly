import type { UseFormRegister } from "react-hook-form"
import type { ProductFormData } from "../pages/products/ProductForm"

type Size =
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL"

interface SizeStockRowProps {
  index: number
  register: UseFormRegister<ProductFormData>
  remove: (index: number) => void
  disabled: boolean
}

const sizeOptions: Size[] = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
]

const SizeStockRow = ({
  index,
  register,
  remove,
  disabled,
}: SizeStockRowProps) => {
  return (
    <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
      <select
        {...register(`sizes.${index}.size`)}
        className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#183c32]"
      >
        {sizeOptions.map((size) => (
          <option
            key={size}
            value={size}
          >
            {size}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="0"
        {...register(`sizes.${index}.stock`, {
          valueAsNumber: true,
          min: {
            value: 0,
            message: "Stock cannot be negative",
          },
        })}
        placeholder="Stock"
        className="min-w-0 rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#183c32] focus:ring-2 focus:ring-[#183c32]/10"
      />

      <button
        type="button"
        onClick={() => remove(index)}
        disabled={disabled}
        className="rounded-xl border border-stone-300 px-4 text-sm text-stone-500 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Remove
      </button>
    </div>
  )
}

export default SizeStockRow