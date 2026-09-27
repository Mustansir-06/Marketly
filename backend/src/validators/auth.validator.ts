import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required").bail()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required").bail()
    .isEmail().withMessage("Please enter a valid email").bail()
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required").bail()
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters").bail()
    .matches(/\d/).withMessage("Password must contain at least one number").bail()
    .matches(/[a-zA-Z]/).withMessage("Password must contain at least one letter"),

  body("confirmPassword")
    .notEmpty().withMessage("Please confirm your password").bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required").bail()
    .isEmail().withMessage("Please enter a valid email").bail()
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),
];