import express from "express"
import { authUser } from "../middleware/auth.middleware.js"
import { addToCartController, checkoutController, getCartController, removeCartItemController, updateCartItemController } from "../controllers/cart.controller.js"
import { addToCartValidator, updateCartItemValidator } from "../validators/cart.validator.js"
import { validate } from "../middleware/validate.js"
const router=express.Router()
router.get("/", authUser, getCartController)
router.post("/items", authUser,addToCartValidator, validate, addToCartController)
router.put("/items/:itemId", authUser,updateCartItemValidator, validate,updateCartItemController)
router.delete("/items/:itemId", authUser, removeCartItemController)
router.post("/checkout", authUser, checkoutController)
export default router