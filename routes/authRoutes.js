const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validations = require("../middlewares/validations");

router.post("/signup", validations.validateSignup, authController.signup);
router.post("/login", authController.login);

module.exports = router;