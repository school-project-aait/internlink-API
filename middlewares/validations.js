
const { body, validationResult } = require("express-validator");

exports.validateSignup = [
  // Validate and sanitize email
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  // Validate password
  body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
  .withMessage('Password must contain uppercase, lowercase, and number'),

  // Confirm password match
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  // Validate birth date
  body("birth_date")
    .isISO8601({ strict: true })
    .withMessage("Invalid date format. Use YYYY-MM-DD"),

  // Final validation result check
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];









// const { body, validationResult } = require("express-validator");
// const bcrypt = require("bcrypt");

// exports.validateSignup = [
//   body("email").isEmail().normalizeEmail(),
//   body("password")
//     .isLength({ min: 8 })
//     .withMessage("Password must be at least 8 characters"),
//   body("confirmPassword").custom((value, { req }) => {
//     if (value !== req.body.password) {
//       throw new Error("Passwords do not match");
//     }
//     return true;
//   }),
//   body("birth_date")
//     .isDate({ format: "YYYY-MM-DD" })
//     .withMessage("Invalid date format. Use YYYY-MM-DD"),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   }
// ];