const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');

// Get current user's profile
router.get('/profile', authenticate, userController.getProfile);

// Update user's OWN account
router.put('/:id', authenticate, userController.updateUser);

// Delete user's OWN account 
router.delete('/:id', authenticate, userController.deleteUser);

module.exports = router;
