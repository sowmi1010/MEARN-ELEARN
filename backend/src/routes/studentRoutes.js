const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const auth = require("../middlewares/auth");
const checkPermission = require("../middlewares/permission");
const Student = require("../models/Student");

const router = express.Router();

// Ensure uploads/students folder exists
const uploadDir = path.join(__dirname, "../../uploads/students");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created folder: uploads/students");
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Helper → remove password before sending response
function sanitizeStudent(student) {
  const obj = student.toObject();
  delete obj.password;
  return obj;
}

// Create Student
router.post(
  "/detailed-student",
  auth,
  checkPermission("students"),
  upload.single("photo"),
  async (req, res) => {
    try {
      const data = req.body;

      if (
        !data.firstName ||
        !data.email ||
        !data.phone ||
        !data.userId ||
        !data.password
      ) {
        return res.status(400).json({ message: "Required fields missing" });
      }

      const existing = await Student.findOne({ email: data.email });
      if (existing) {
        return res.status(400).json({ message: "Email already exists" });
      }

      data.password = await bcrypt.hash(data.password, 10);

      if (req.file) {
        data.photo = `/uploads/students/${req.file.filename}`;
      }

      const student = await Student.create(data);
      res.json({
        message: "Student created successfully",
        student: sanitizeStudent(student),
      });
    } catch (err) {
      console.error("Student create error:", err);
      res.status(500).json({
        message: "Failed to create student",
        error: err.message,
      });
    }
  }
);

// Get All Students
router.get("/detailed-students", auth, checkPermission("students"), async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students.map(sanitizeStudent));
  } catch (err) {
    console.error("Fetch students error:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

// Get One Student
router.get("/detailed-students/:id", auth, checkPermission("students"), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(sanitizeStudent(student));
  } catch (err) {
    console.error("Fetch student error:", err);
    res.status(500).json({ message: "Failed to fetch student" });
  }
});

// Update Student
router.put(
  "/detailed-students/:id",
  auth,
  checkPermission("students"),
  upload.single("photo"),
  async (req, res) => {
    try {
      const updates = { ...req.body };

      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
      if (req.file) {
        updates.photo = `/uploads/students/${req.file.filename}`;
      }

      const student = await Student.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
      );

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json({
        message: "Student updated successfully",
        student: sanitizeStudent(student),
      });
    } catch (err) {
      console.error("Update student error:", err);
      res.status(500).json({ message: "Failed to update student" });
    }
  }
);

// Delete Student
router.delete("/detailed-students/:id", auth, checkPermission("students"), async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    console.error("Delete student error:", err);
    res.status(500).json({ message: "Failed to delete student" });
  }
});

// ===============================
// ⭐ Student: View Own Profile
// ===============================
router.get("/profile", auth, async (req, res) => {
  try {
    const studentId = req.user._id;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(sanitizeStudent(student));
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

// ===============================
// ⭐ Student: Update Own Profile
// ===============================
router.put(
  "/profile",
  auth,
  upload.single("photo"),
  async (req, res) => {
    try {
      const studentId = req.user._id;
      const updates = { ...req.body };

      // Don't allow updating userId, fees, password here
      delete updates.userId;
      delete updates.fees;
      delete updates.password;

      if (req.file) {
        updates.photo = `/uploads/students/${req.file.filename}`;
      }

      const student = await Student.findByIdAndUpdate(
        studentId,
        updates,
        { new: true }
      );

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json({
        message: "Profile updated successfully",
        student: sanitizeStudent(student),
      });
    } catch (err) {
      console.error("Profile update error:", err);
      res.status(500).json({ message: "Failed to update profile" });
    }
  }
);



module.exports = router;
