
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



exports.validateInternship = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must not exceed 255 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("deadline")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("Invalid date format for deadline. Use YYYY-MM-DD"),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean value (true/false)"),

  body("status")
    .optional()
    .isIn(["open", "closed"])
    .withMessage("Status must be either 'open' or 'closed'"),

  body("company_id")
    .notEmpty()
    .withMessage("Company ID is required")
    .isInt()
    .withMessage("Company ID must be an integer"),

  body("category_id")
    .notEmpty()
    .withMessage("Category ID is required")
    .isInt()
    .withMessage("Category ID must be an integer"),

  body("created_by")
    .notEmpty()
    .withMessage("Created By (user ID) is required")
    .isInt()
    .withMessage("Created By must be an integer"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
