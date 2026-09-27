import express from "express"
import { createProductController, deleteProductController, getAllProductsController, getByIdProductController, getMyProductsController, updateProductController } from "../controllers/product.controller.js"
import { authUser } from "../middleware/auth.middleware.js"
import { createProductValidator, updateProductValidator, productIdValidator } from "../validators/product.validator.js"
import { validate } from "../middleware/validate.js"
import { authorizeRole } from "../middleware/role.middleware.js"
import { parseProductFields } from "../middleware/parseProductFields.middleware.js"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()

router.post("/", authUser, authorizeRole("seller"), upload.array("images",3),parseProductFields, createProductValidator, validate, createProductController)
router.get("/", getAllProductsController)
router.get("/my-products", authUser, authorizeRole("seller"), getMyProductsController)
router.get("/:id", productIdValidator, validate, getByIdProductController)
router.put("/:id", authUser, authorizeRole("seller"), upload.array("images",3),parseProductFields, updateProductValidator, validate, updateProductController)
router.delete("/:id", authUser, authorizeRole("seller"), productIdValidator, validate, deleteProductController)

export default router