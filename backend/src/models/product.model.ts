import mongoose, { Document } from "mongoose";

interface IPrice {
  amount: number;
  currency: "INR" | "USD";
}

interface ISize {
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  stock: number;
}

interface IProduct extends Document {
  title: string;
  description: string;
  images: string[];
  price: IPrice;
  category: "clothing" | "general";
  stock?: number;
  sizes?: ISize[];
  seller: mongoose.Types.ObjectId;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 500
  },
  images: [{
    type: String,
    required: true
  }],
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR"
    }
  },
  category: {
    type: String,
    enum: ["clothing", "general"],
    required: true
  },
  stock: {
    type: Number,
    min: 0
  },
  sizes: [{
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    stock: {
      type: Number,
      min: 0,
      default: 0
    }
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
}, { timestamps: true })

const productModel = mongoose.model<IProduct>("product", productSchema)
export default productModel