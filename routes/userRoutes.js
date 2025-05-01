const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authenticate");

// router.put("/:id", userController.updateUser);
// router.delete("/:id", userController.deleteUser);
// routes/userRoutes.js

// fetch user information
router.get("/profile", authMiddleware, userController.getProfile);

router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);

module.exports = router;
