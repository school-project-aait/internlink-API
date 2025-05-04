const express = require("express");
const router = express.Router();
const application = require("../controllers/applicationController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

// Student applies to an internship
router.post("/", authenticate, application.applyToInternship);

// Student views their own applications
router.get(
  "/my-applications",
  authenticate,
  application.getMyApplications
);

// Student updates their own application
router.put("/:id", authenticate, application.updateApplication);

// Student withdraws (deletes) their own application
router.delete(
  "/:id/withdraw",
  authenticate,
  application.withdrawApplication
);

// Admin changes the status of an application (accepted, rejected, pending)
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  application.changeApplicationStatus
);

module.exports = router;
