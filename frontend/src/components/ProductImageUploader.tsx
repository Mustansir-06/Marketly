import { useState } from "react"

export interface ImageItem {
  id: string
  source: string
  file?: File
}

interface ProductImageUploaderProps {
  images: ImageItem[]
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>
}

const ProductImageUploader = ({
  images,
  setImages,
}: ProductImageUploaderProps) => {
  const [error, setError] = useState("")

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || [])

    if (!files.length) return

    const availableSlots = 3 - images.length

    if (availableSlots === 0) {
      setError("You can upload a maximum of 3 images.")
      return
    }

    const selectedFiles = files.slice(0, availableSlots)

    const newImages: ImageItem[] = selectedFiles.map(
      (file) => ({
        id: `${file.name}-${file.lastModified}`,
        source: URL.createObjectURL(file),
        file,
      })
    )

    setImages((previousImages) => [
      ...previousImages,
      ...newImages,
    ])

    if (files.length > availableSlots) {
      setError("Only 3 images can be uploaded.")
    } else {
      setError("")
    }

    event.target.value = ""
  }

  const removeImage = (id: string) => {
    setImages((previousImages) => {
      const imageToRemove = previousImages.find(
        (image) => image.id === id
      )

      if (imageToRemove?.file) {
        URL.revokeObjectURL(imageToRemove.source)
      }

      return previousImages.filter(
        (image) => image.id !== id
      )
    })

    setError("")
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
              onClick={() => removeImage(image.id)}
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

      {error && (
        <p className="mt-3 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default ProductImageUploader