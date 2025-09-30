const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { register, login } = require("../controllers/authController");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

const User = require("../models/User");       // Super admin / simple students
const Mentor = require("../models/Mentor");   // Mentors
const Student = require("../models/Student"); // ✅ Detailed students

// ====================
// Auth Routes
// ====================
router.post("/register", register); // Super Admin / Simple Students
router.post("/login", login);       // All roles (handled in controller)

// ====================
// List Students (Admin / Mentor with "students" permission)
// ====================
router.get("/users", auth, permission("students"), async (req, res) => {
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
// Profile Upload (User / Mentor / Detailed Student)
// ====================

// Ensure uploads/profile folder exists
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

router.post(
  "/upload-profile",
  auth,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      let userDoc;
      const imagePath = `/uploads/profile/${req.file.filename}`;

      // ✅ Handle all roles
      if (req.user.role === "mentor") {
        userDoc = await Mentor.findById(req.user.id);
        if (!userDoc) return res.status(404).json({ message: "Mentor not found" });
        userDoc.photo = imagePath;
      } 
      else if (req.user.role === "student") {
        // Detailed Student collection
        userDoc = await Student.findById(req.user.id);
        if (!userDoc) {
          // If not in Student collection → try User collection
          userDoc = await User.findById(req.user.id);
        }
        if (!userDoc) return res.status(404).json({ message: "Student not found" });

        // Set profile image
        if (userDoc.photo !== undefined) userDoc.photo = imagePath; // for Student model
        else userDoc.profilePic = imagePath; // for User model
      } 
      else {
        // Super Admin
        userDoc = await User.findById(req.user.id);
        if (!userDoc) return res.status(404).json({ message: "User not found" });
        userDoc.profilePic = imagePath;
      }

      await userDoc.save();

      res.json({
        message: "Profile picture updated",
        profilePic: userDoc.profilePic || userDoc.photo,
      });
    } catch (err) {
      console.error("❌ Upload profile error:", err.message);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

module.exports = router;
