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
  getCurrentUser,
} = require("../controllers/authController");

const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Student = require("../models/Student");
const Admin = require("../models/Admin");

/* ======================================================
   ✅ AUTH ROUTES
====================================================== */
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-code", verifyResetCode);
router.post("/reset-password", resetPassword);

/* ======================================================
   ✅ PROFILE UPLOAD (Common for all roles)
====================================================== */
const uploadDir = path.join(__dirname, "../../uploads/profile");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${cleanName}`);
  },
});

const upload = multer({ storage });

router.post(
  "/upload-profile",
  auth,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      const imagePath = `/uploads/profile/${req.file.filename}`;
      const { id, role, isSuperAdmin } = req.user;
      let userDoc = null;

      console.log("🧠 Upload Debug:", { id, role, isSuperAdmin });

      // ✅ SuperAdmin (always from User collection)
      if (isSuperAdmin === true) {
        userDoc = await User.findById(id);
        if (!userDoc) {
          console.log("❌ SuperAdmin not found in User collection");
          return res.status(404).json({ message: "SuperAdmin not found" });
        }
        userDoc.profilePic = imagePath;
      }

      // ✅ Admin (normal admin)
      else if (role === "admin") {
        userDoc = await Admin.findById(id);
        if (!userDoc) {
          console.log("⚠️ Admin not found in Admin, checking User...");
          userDoc = await User.findById(id);
        }
        if (!userDoc)
          return res.status(404).json({ message: "Admin not found" });
        userDoc.profilePic = imagePath;
      }

      // ✅ Mentor
      else if (role === "mentor") {
        userDoc = await Mentor.findById(id);
        if (!userDoc)
          return res.status(404).json({ message: "Mentor not found" });
        userDoc.photo = imagePath;
      }

      // ✅ Student
      else if (role === "student") {
        userDoc = await Student.findById(id);
        if (!userDoc)
          return res.status(404).json({ message: "Student not found" });
        userDoc.photo = imagePath;
      }

      // ✅ Default user
      else {
        userDoc = await User.findById(id);
        if (!userDoc)
          return res.status(404).json({ message: "User not found" });
        userDoc.profilePic = imagePath;
      }

      // ✅ Save without validation (bypass phone/userId check)
      await userDoc.save({ validateBeforeSave: false });

      console.log("✅ Profile updated successfully:", userDoc.email);

      return res.json({
        message: "Profile picture updated successfully",
        profilePic: userDoc.profilePic || userDoc.photo,
      });
    } catch (err) {
      console.error("❌ Upload failed (Server Crash):", err);
      res.status(500).json({
        message: "Upload failed",
        error: err.message,
      });
    }
  }
);
/* ======================================================
   ✅ FETCH CURRENT USER (/auth/me)
====================================================== */
router.get("/me", auth, getCurrentUser);

/* ======================================================
   ✅ ADMIN / MENTOR DASHBOARD ACCESS
====================================================== */
router.get("/users", auth, permission("dashboard"), async (req, res) => {
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
    console.error("Fetch users error:", err);
    res.status(500).json({
      message: "Failed to fetch users",
      error: err.message,
    });
  }
});

/* ======================================================
   ✅ EXPORT ROUTER
====================================================== */
module.exports = router;
