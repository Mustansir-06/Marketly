import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "../routes/auth.routes.js"
import productRoutes from "../routes/products.routes.js"
import cartRoutes from "../routes/cart.route.js"
import assistantRoutes from "../routes/assistant.route.js"
import multer from "multer"
import config from "../config/config.js"

const app = express()
app.use(express.json())
app.use(cors({
    origin: config.CLIENT_URL,
    credentials: true
}))
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/assistant", assistantRoutes)
app.use((req, res) => res.status(404).json({ message: "Route not found" }))
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ message: "You can upload a maximum of 3 images" })
    }
    if (err) {
        return res.status(500).json({ message: "internal server error" })
    }
    next()
})
export default app