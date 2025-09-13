// backend/src/routes/auth.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { register, login } = require("../controllers/authController");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const User = require("../models/User");

// Auth routes
router.post("/register", register);
router.post("/login", login);

// ADMIN: list students
router.get("/users", auth, role("admin"), async (req, res) => {
  try {
    const users = await User.find({ role: "student" }).select(
      "name email createdAt enrolledCourses profilePic"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====================
// Profile Upload
// ====================

// Ensure uploads/profile exists
const uploadDir = path.join(__dirname, "../../uploads/profile");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// Upload profile picture
router.post(
  "/upload-profile",
  auth,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const user = await User.findById(req.user._id); // ✅ use _id consistently
      if (!user) return res.status(404).json({ message: "User not found" });

      // Save relative path
      user.profilePic = `/uploads/profile/${req.file.filename}`;
      await user.save();

      res.json({
        message: "Profile picture updated",
        profilePic: user.profilePic,
      });
    } catch (err) {
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

module.exports = router;
