import express from "express"
import { getMeController, loginController, logoutController, refreshController, registerController } from "../controllers/auth.controller.js"
import { loginValidator, registerValidator } from "../validators/auth.validator.js"
import { validate } from "../middleware/validate.js"
import { authUser } from "../middleware/auth.middleware.js"
import { refreshUser } from "../middleware/refresh.middleware.js"
import { loginLimiter } from "../middleware/rateLimiter.middleware.js"
const router=express.Router()
router.post("/register",registerValidator,validate,registerController)
router.post("/login",loginLimiter,loginValidator,validate,loginController)
router.post("/refresh-token",refreshUser,refreshController)
router.post("/logout",authUser,logoutController)
router.get("/me",authUser,getMeController)
export default router