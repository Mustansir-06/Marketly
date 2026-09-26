export interface Product {
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
    size: "XS" | "S" | "M" | "L" | "XL" | "XXL"
    stock: number
  }[]
  seller: {
    _id: string
    name: string
  }
  createdAt: string
}