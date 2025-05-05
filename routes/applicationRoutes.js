const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');
// Student application endpoints
// router.post('/', authenticate, applicationController.createApplication);
router.get('/', authenticate, applicationController.getUserApplications);
router.put('/:id', authenticate, applicationController.updateApplication);
router.delete('/:id', authenticate, applicationController.deleteApplication);
router.get('/:id', authenticate, applicationController.getSingleApplication);


// Apply `upload.single('resume')` to handle file upload
router.post('/', authenticate, upload.single('resume'), applicationController.createApplication);


module.exports = router;