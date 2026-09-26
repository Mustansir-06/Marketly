import { Request, Response } from "express"
import mongoose from "mongoose"
import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"

export const addToCartController = async (req: Request, res: Response) => {
    try {
        const { productId, quantity, size } = req.body
        const userId = req.user!.id

        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        if (product.seller.toString() === userId) {
            return res.status(403).json({ message: "You cannot add your own product to cart" })
        }

        let cart = await cartModel.findOne({ user: userId })
        if (!cart) {
            cart = await cartModel.create({ user: userId, items: [] })
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId && item.size === size
        )

        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            cart.items.push({ product: productId, quantity, size })
        }

        await cart.save()
        return res.status(200).json({ message: "Added to cart", cart })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}

export const getCartController = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id
        const cart = await cartModel.findOne({ user: userId }).populate("items.product")
        return res.status(200).json({
            message: "Cart fetched successfully",
            cart: cart ?? { user: userId, items: [] }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}

export const updateCartItemController = async (req: Request, res: Response) => {
    try {
        const itemId = req.params.itemId as string
        const { quantity } = req.body
        const userId = req.user!.id

        const cart = await cartModel.findOne({ user: userId })
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }

        const item = cart.items.id(itemId)
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" })
        }

        item.quantity = quantity
        await cart.save()
        const populatedCart = await cart.populate("items.product")
        return res.status(200).json({ message: "Cart updated", cart: populatedCart })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}

export const removeCartItemController = async (req: Request, res: Response) => {
    try {
        const itemId = req.params.itemId as string
        const userId = req.user!.id

        const cart = await cartModel.findOne({ user: userId })
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }

        cart.items.id(itemId)?.deleteOne()
        await cart.save()
        const populatedCart = await cart.populate("items.product")
        return res.status(200).json({ message: "Item removed", cart: populatedCart })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}

export const checkoutController = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id

        const result = await cartModel.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "items.productDetails"
                }
            },
            { $unwind: "$items.productDetails" },
            {
                $project: {
                    _id: 0,
                    quantity: "$items.quantity",
                    size: "$items.size",
                    productId: "$items.productDetails._id",
                    title: "$items.productDetails.title",
                    category: "$items.productDetails.category",
                    stock: "$items.productDetails.stock",
                    sizes: "$items.productDetails.sizes"
                }
            }
        ])

        if (result.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" })
        }

        for (const item of result) {
            if (item.category === "clothing") {
                const sizeEntry = item.sizes?.find((s: any) => s.size === item.size)
                if (!sizeEntry || sizeEntry.stock < item.quantity) {
                    return res.status(400).json({ message: `${item.title} does not have enough stock in size ${item.size}` })
                }
            } else {
                if ((item.stock ?? 0) < item.quantity) {
                    return res.status(400).json({ message: `${item.title} does not have enough stock` })
                }
            }
        }

        for (const item of result) {
            const product = await productModel.findById(item.productId)
            if (!product) continue

            if (product.category === "clothing") {
                const sizeEntry = product.sizes?.find((s) => s.size === item.size)
                if (sizeEntry) sizeEntry.stock -= item.quantity
            } else {
                product.stock = (product.stock ?? 0) - item.quantity
            }
            await product.save()
        }

        await cartModel.updateOne({ user: userId }, { $set: { items: [] } })

        return res.status(200).json({ message: "Checkout successful" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}