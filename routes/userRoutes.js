const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate'); // Now matches export
const authorize = require('../middlewares/authorize');

// Example route - adjust according to your actual routes
router.put('/:id', 
  authenticate, 
  authorize('admin'), 
  userController.updateUser
);

module.exports = router;