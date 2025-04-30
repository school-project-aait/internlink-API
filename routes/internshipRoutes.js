const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const dropdownController = require('../controllers/dropdownController');
const authenticate = require('../middlewares/authenticate'); // Now matches export
const authorize = require('../middlewares/authorize'); 
const { validateInternship } = require('../middlewares/validations');

// Get dropdown data (public)
router.get('/dropdown-data', dropdownController.getDropdownData);
router.get('/companies/:categoryId', dropdownController.getCompaniesByCategory);

// Internship routes (protected, admin only)
router.post('/', authenticate, authorize('admin'), validateInternship, internshipController.createInternship);
router.get('/', authenticate, internshipController.getAllInternships);
router.put('/:id', 
  authenticate,
  authorize('admin'),
  internshipController.updateInternship
);
router.delete('/:id', 
  authenticate,
  authorize('admin'),
  internshipController.deleteInternship
);

module.exports = router;