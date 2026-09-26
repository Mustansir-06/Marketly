import { Request, Response } from "express"
import { groq } from "../services/groq.service.js"
import productModel from "../models/product.model.js"

export const chatController = async (req: Request, res: Response) => {
    try {
        const { message, history } = req.body
        if (!message) {
            return res.status(400).json({
                message: "message is required"
            })
        }

        const words = message.toLowerCase().split(" ")

        let matchedProducts: any[] = []

        for (const word of words) {
            const found = await productModel.find({
                title: { $regex: word, $options: "i" }
            })
            matchedProducts.push(...found)
        }

        let uniqueProducts = Array.from(
            new Map(matchedProducts.map((p) => [p._id.toString(), p])).values()
        )

        if (uniqueProducts.length === 0) {
            uniqueProducts = await productModel.find().sort({ createdAt: -1 }).limit(5)
        }

        let productInfo = "No matching products were found in the store."
        if (uniqueProducts.length > 0) {
            productInfo = uniqueProducts
                .map((p) => {
                    const stockText = p.category === "general"
                        ? `stock: ${p.stock ?? 0}`
                        : `sizes: ${p.sizes?.map((s: any) => `${s.size}(${s.stock})`).join(", ")}`
                    return `- ${p.title}, price: ${p.price.amount} ${p.price.currency}, category: ${p.category}, ${stockText}`
                })
                .join("\n")
        }

        const conversationMessages = (history || []).map((m: any) => ({
            role: m.role,
            content: m.content
        }))

        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a helpful shopping assistant for an online store called Marketly. Only answer questions related to this store — products, prices, sizes, categories, or how to use the site. If the user asks about anything unrelated to the store, politely say you can only help with store-related questions.

Only recommend products from this list. Do not make up any product that isn't listed here. If nothing matches what the user wants, say so honestly.

Products found for this question:
${productInfo}`
                },
                ...conversationMessages,
                {
                    role: "user",
                    content: message
                }
            ],
            model: "openai/gpt-oss-20b"
        })

        const reply = response.choices[0].message.content
        return res.status(200).json({
            message: "Assistant message",
            reply
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "internal server error"
        })
    }
}