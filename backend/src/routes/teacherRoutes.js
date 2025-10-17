const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const Teacher = require("../models/Teacher");
const auth = require("../middlewares/auth");
const checkPermission = require("../middlewares/permission");

// Ensure uploads/teachers folder exists
const uploadDir = path.join(__dirname, "../../uploads/teachers");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created folder: uploads/teachers");
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

/* =========================================================
   ✅ ADD TEACHER (Admin or Mentor with "teachers" permission)
========================================================= */
router.post(
  "/",
  auth,
  checkPermission("teachers"),
  upload.single("photo"),
  async (req, res) => {
    try {
      const { name, subject, description } = req.body;

      if (!name || !subject || !description) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const teacher = await Teacher.create({
        name,
        subject,
        description,
        photo: req.file ? `/uploads/teachers/${req.file.filename}` : null,
      });

      res.json({ message: "Teacher added successfully", teacher });
    } catch (err) {
      console.error("Add teacher error:", err);
      res.status(500).json({ message: "Failed to add teacher" });
    }
  }
);

/* =========================================================
   ✅ GET ALL TEACHERS (Public)
========================================================= */
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    console.error("Fetch teachers error:", err);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
});

/* =========================================================
   ✅ UPDATE TEACHER (Admin or Mentor with "teachers" permission)
========================================================= */
router.put(
  "/:id",
  auth,
  checkPermission("teachers"),
  upload.single("photo"),
  async (req, res) => {
    try {
      const { name, subject, description } = req.body;
      const teacher = await Teacher.findById(req.params.id);
      if (!teacher) return res.status(404).json({ message: "Teacher not found" });

      // Handle photo update (if new photo uploaded)
      if (req.file) {
        // Delete old photo if exists
        if (teacher.photo && fs.existsSync(path.join(__dirname, "../../", teacher.photo))) {
          fs.unlinkSync(path.join(__dirname, "../../", teacher.photo));
        }
        teacher.photo = `/uploads/teachers/${req.file.filename}`;
      }

      // Update text fields
      if (name) teacher.name = name;
      if (subject) teacher.subject = subject;
      if (description) teacher.description = description;

      await teacher.save();

      res.json({ message: "Teacher updated successfully", teacher });
    } catch (err) {
      console.error("Update teacher error:", err);
      res.status(500).json({ message: "Failed to update teacher" });
    }
  }
);

/* =========================================================
   ✅ DELETE TEACHER (Admin or Mentor with "teachers" permission)
========================================================= */
router.delete("/:id", auth, checkPermission("teachers"), async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    if (teacher.photo && fs.existsSync(path.join(__dirname, "../../", teacher.photo))) {
      fs.unlinkSync(path.join(__dirname, "../../", teacher.photo));
    }

    await teacher.deleteOne();
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    console.error("Delete teacher error:", err);
    res.status(500).json({ message: "Failed to delete teacher" });
  }
});

module.exports = router;
