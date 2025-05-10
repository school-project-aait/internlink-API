const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');
const authorize = require('../middlewares/authorize');
// Student application endpoints
router.get('/only-admins', authenticate,authorize('admin'), applicationController.getAllApplications);
router.get('/', authenticate, applicationController.getUserApplications);
router.put('/:id', authenticate, applicationController.updateApplication);
router.delete('/:id', authenticate, applicationController.deleteApplication);
router.get('/:id', authenticate, applicationController.getSingleApplication);


// Apply `upload.single('resume')` to handle file upload
router.post('/', authenticate, upload.single('resume'), applicationController.createApplication);

 
// Admin application endpoints
router.patch(
    "/:id/status",
    authenticate,
    authorize('admin'),
    applicationController.changeApplicationStatus
  );


module.exports = router;