const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const authenticate = require('../middlewares/authenticate'); // ⬅️ Import authenticate
const authorize = require('../middlewares/authorize'); // ⬅️ Import authorize
const { validateInternship } = require('../middlewares/validations'); // ⬅️ Import validation

// CREATE Internship (Admin only, with validation)
router.post(
  '/',
  authenticate, 
  authorize('admin'), 
  validateInternship, 
  internshipController.createInternship
);

// READ All Internships (Public, no auth needed)
router.get('/', internshipController.getAllInternships);

// READ Single Internship by ID (Public, no auth needed)
router.get('/:id', internshipController.getInternshipById);

// UPDATE Internship (Admin only, with validation)
router.patch(
  '/:id', 
  authenticate, 
  authorize('admin'), 
  validateInternship, 
  internshipController.updateInternship
);

// DELETE Internship (Admin only)
router.delete(
  '/:id', 
  authenticate, 
  authorize('admin'), 
  internshipController.deleteInternship
);

module.exports = router;
