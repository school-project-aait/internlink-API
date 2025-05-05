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


exports.validateInternship = (req, res, next) => {
  const { title, company_name, category_id, deadline } = req.body;
  
  if (!title || !company_name || !category_id || !deadline) {
    return res.status(400).json({ 
      success: false, 
      message: 'Title, company name, category, and deadline are required' 
    });
  }
  
  // Additional validation can be added here
  if (typeof company_name !== 'string' || company_name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Company name must be a non-empty string'
    });
  }
  
  next();
};

exports.validateApplication = (applicationData) => {
  const errors = {};

  if (!applicationData.university?.trim()) {
    errors.university = "University name is required";
  }

  if (!applicationData.degree?.trim()) {
    errors.degree = "Degree program is required";
  }

  if (!applicationData.graduation_year) {
    errors.graduation_year = "Graduation year is required";
  } else if (applicationData.graduation_year < 2000 || applicationData.graduation_year > 2030) {
    errors.graduation_year = "Enter a valid year between 2000-2030";
  }

if (applicationData.linkdIn?.trim() && !applicationData.linkdIn.includes('linkedin.com')) {
  errors.linkdIn = "Enter a valid LinkedIn URL";
}

  return errors;
};