const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
// update user
exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }
    delete updates.role;
    delete updates.email;

    const result = await userModel.updateUser(req.params.id, updates);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    console.log("req.user:", req.user);
    console.log("userId:", userId);

    if (req.user.id  !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this user" });
    }

    const user = await userModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await userModel.deleteUser(userId);

    if (result.affectedRows === 0) {
      return res
        .status(500)
        .json({ message: "Unexpected error during deletion" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({
      error: "Failed to delete user",
      details: error.message,
    });
  }
};

// fetch user information

exports.getProfile = async (req, res) => {
  try {
    const user = await userModel.findUserById(req.user.id); // assuming JWT token sets userId
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude sensitive info like password_hash
    const { password_hash, ...safeUser } = user;

    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// exports.deleteUser = async (req, res) => {
//   try {
//     console.log("req.user:", req.user);
//     console.log("req.params.id:", req.params.id);

//     if (req.user.userId !== parseInt(req.params.id)) {
//       return res.status(403).json({ message: "Unauthorized to delete this user" });
//     }

//     const user = await userModel.findUserById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const result = await userModel.deleteUser(req.params.id);

//     if (result.affectedRows === 0) {
//       return res.status(500).json({ message: "Unexpected error during deletion" });
//     }

//     res.json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Delete User Error:", error);
//     res.status(500).json({
//       error: "Failed to delete user",
//       details: error.message
//     });
//   }
// };

// exports.deleteUser = async (req, res) => {
//   try {
//     if (req.user.userId !== parseInt(req.params.id)) {
//       return res.status(403).json({ message: "Unauthorized to delete this user" });
//     }

//     // First verify user exists
//     const user = await userModel.findUserById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Proceed with deletion
//     const result = await userModel.deleteUser(req.params.id);

//     if (result.affectedRows === 0) {
//       return res.status(500).json({ message: "Unexpected error during deletion" });
//     }

//     res.json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Delete User Error:", error);
//     res.status(500).json({
//       error: "Failed to delete user",
//       details: error.message
//     });
//   }
// };

// exports.deleteUser = async (req, res) => {
//   try {
//     const result = await userModel.deleteUser(req.params.id);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json({ message: "User deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
