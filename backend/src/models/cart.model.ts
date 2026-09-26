import mongoose, { Document, Types } from "mongoose";

interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  size?: "XS" | "S" | "M" | "L" | "XL" | "XXL";
}

interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: Types.DocumentArray<ICartItem>;
}

const cartSchema = new mongoose.Schema<ICart>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"]
    }
  }]
}, { timestamps: true })

const cartModel = mongoose.model<ICart>("cart", cartSchema)
export default cartModel