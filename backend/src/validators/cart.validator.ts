import { body } from "express-validator";

export const addToCartValidator = [
  body("productId")
    .notEmpty().withMessage("Product id is required").bail()
    .isMongoId().withMessage("Invalid product id"),

  body("quantity")
    .notEmpty().withMessage("Quantity is required").bail()
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),

  body("size")
    .optional()
    .isIn(["XS", "S", "M", "L", "XL", "XXL"]).withMessage("Invalid size"),
];

export const updateCartItemValidator = [
  body("quantity")
    .notEmpty().withMessage("Quantity is required").bail()
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];