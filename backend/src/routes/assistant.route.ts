import express from "express"
import { chatController } from "../controllers/assistant.controller.js"
import { authUser } from "../middleware/auth.middleware.js"
const router=express.Router()
router.post("/chat", authUser, chatController)
export default router