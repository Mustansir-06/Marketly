import { body, param } from "express-validator";

export const productIdValidator = [
  param("id")
    .isMongoId().withMessage("Invalid product id"),
];

export const createProductValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required").bail()
    .isLength({ min: 2, max: 100 }).withMessage("Title must be between 2 and 100 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required").bail()
    .isLength({ min: 20, max: 500 }).withMessage("Description must be between 20 and 500 characters"),

  body("price.amount")
    .notEmpty().withMessage("Price amount is required").bail()
    .isFloat({ gt: 0 }).withMessage("Price amount must be a number greater than 0"),

  body("price.currency")
    .optional()
    .isIn(["INR", "USD"]).withMessage("Currency must be INR or USD"),

  body("category")
    .notEmpty().withMessage("Category is required").bail()
    .isIn(["clothing", "general"]).withMessage("Category must be clothing or general"),

  body("stock")
    .if(body("category").equals("general"))
    .notEmpty().withMessage("Stock is required for general products").bail()
    .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

  body("sizes")
    .if(body("category").equals("clothing"))
    .isArray({ min: 1 }).withMessage("At least one size is required for clothing products"),
  body("sizes.*.size")
    .if(body("category").equals("clothing"))
    .isIn(["XS", "S", "M", "L", "XL", "XXL"]).withMessage("Invalid size value"),
  body("sizes.*.stock")
    .if(body("category").equals("clothing"))
    .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
];

export const updateProductValidator = [
  param("id")
    .isMongoId().withMessage("Invalid product id"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Title must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 20, max: 500 }).withMessage("Description must be between 20 and 500 characters"),

  body("price.amount")
    .optional()
    .isFloat({ gt: 0 }).withMessage("Price amount must be a number greater than 0"),

  body("price.currency")
    .optional()
    .isIn(["INR", "USD"]).withMessage("Currency must be INR or USD"),

  body("category")
    .optional()
    .isIn(["clothing", "general"]).withMessage("Category must be clothing or general"),

  body("stock")
    .if(body("category").equals("general"))
    .optional()
    .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

  body("sizes")
    .if(body("category").equals("clothing"))
    .optional()
    .isArray({ min: 1 }).withMessage("At least one size is required for clothing products"),
  body("sizes.*.size")
    .if(body("category").equals("clothing"))
    .optional()
    .isIn(["XS", "S", "M", "L", "XL", "XXL"]).withMessage("Invalid size value"),
  body("sizes.*.stock")
    .if(body("category").equals("clothing"))
    .optional()
    .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
];