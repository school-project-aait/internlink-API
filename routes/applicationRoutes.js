const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authenticate = require('../middlewares/authenticate');

// Student application endpoints
router.post('/', authenticate, applicationController.createApplication);
router.get('/', authenticate, applicationController.getUserApplications);
router.put('/:id', authenticate, applicationController.updateApplication);
router.delete('/:id', authenticate, applicationController.deleteApplication);

module.exports = router;