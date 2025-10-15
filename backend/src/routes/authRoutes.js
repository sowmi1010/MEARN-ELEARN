const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  register,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../controllers/authController");

const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Student = require("../models/Student");

/* ============================================================
   🧩 AUTH ROUTES
============================================================ */

// 🔹 Register / Login / Password routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-code", verifyResetCode);
router.post("/reset-password", resetPassword);

/* ============================================================
   🧩 PROFILE UPLOAD (Common for all roles)
============================================================ */

const uploadDir = path.join(__dirname, "../../uploads/profile");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

router.post("/upload-profile", auth, upload.single("profilePic"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const imagePath = `/uploads/profile/${req.file.filename}`;
    let userDoc;

    if (req.user.role === "mentor") {
      userDoc = await Mentor.findById(req.user.id);
      if (!userDoc) return res.status(404).json({ message: "Mentor not found" });
      userDoc.photo = imagePath;
    } else if (req.user.role === "student") {
      userDoc = await Student.findById(req.user.id) || (await User.findById(req.user.id));
      if (!userDoc) return res.status(404).json({ message: "Student not found" });
      if (userDoc.photo !== undefined) userDoc.photo = imagePath;
      else userDoc.profilePic = imagePath;
    } else {
      userDoc = await User.findById(req.user.id);
      if (!userDoc) return res.status(404).json({ message: "User not found" });
      userDoc.profilePic = imagePath;
    }

    await userDoc.save();
    res.json({
      message: "Profile picture updated successfully ✅",
      profilePic: userDoc.profilePic || userDoc.photo,
    });
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

/* ============================================================
   🧩 ADMIN DASHBOARD — GET ALL USERS
============================================================ */

// ✅ Admin-only route to view all users, mentors, and students
router.get("/users", auth, permission("admin"), async (req, res) => {
  try {
    const [users, mentors, students] = await Promise.all([
      User.find().select("-password -__v").sort({ createdAt: -1 }),
      Mentor.find().select("-password -__v").sort({ createdAt: -1 }),
      Student.find().select("-password -__v").sort({ createdAt: -1 }),
    ]);

    res.json({
      totalUsers: users.length + mentors.length + students.length,
      users,
      mentors,
      students,
    });
  } catch (err) {
    console.error("❌ Fetch users error:", err);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

module.exports = router;
