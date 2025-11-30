// routes/authRoutes.js
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  getCurrentUser,
  uploadMiddleware,
  uploadProfile,
} = require("../controllers/authController");

const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

// AUTH
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-code", verifyResetCode);
router.post("/reset-password", resetPassword);

// GET CURRENT USER
router.get("/me", auth, getCurrentUser);

// UPLOAD PROFILE (use controller's multer middleware)
router.post(
  "/upload-profile",
  auth,
  uploadMiddleware.single("profilePic"), // same field name expected from client
  uploadProfile
);

// ADMIN / MENTOR DASHBOARD (protected)
router.get("/users", auth, permission("dashboard"), async (req, res) => {
  try {
    const [users, mentors, students] = await Promise.all([
      require("../models/User").find().select("-password -__v").sort({ createdAt: -1 }),
      require("../models/Mentor").find().select("-password -__v").sort({ createdAt: -1 }),
      require("../models/Student").find().select("-password -__v").sort({ createdAt: -1 }),
    ]);

    res.json({
      totalUsers: users.length + mentors.length + students.length,
      users,
      mentors,
      students,
    });
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({
      message: "Failed to fetch users",
      error: err.message,
    });
  }
});

module.exports = router;
