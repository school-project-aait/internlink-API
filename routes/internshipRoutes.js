const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const dropdownController = require('../controllers/dropdownController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize'); 
const { validateInternship } = require('../middlewares/validations');

// Simplified dropdown endpoint (categories only)
router.get('/dropdown-data', dropdownController.getDropdownData);

// Internship CRUD routes
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateInternship, // Now validates company_name string
  internshipController.createInternship
);

router.get('/', authenticate, internshipController.getAllInternships);
router.get(
  '/:id',
  authenticate,
  internshipController.getInternshipById
);
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  internshipController.updateInternship // Handles company_name updates
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  internshipController.deleteInternship
);

module.exports = router;