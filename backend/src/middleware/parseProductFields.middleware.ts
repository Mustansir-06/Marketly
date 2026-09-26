import { Request, Response, NextFunction } from "express"

export const parseProductFields = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.body.price === "string") {
            req.body.price = JSON.parse(req.body.price)
        }
        if (typeof req.body.sizes === "string") {
            req.body.sizes = JSON.parse(req.body.sizes)
        }
        next()
    } catch (error) {
        return res.status(400).json({ message: "Invalid price or sizes format" })
    }
}