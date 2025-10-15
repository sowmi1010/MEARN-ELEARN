// backend/src/routes/mentor.js
const express = require("express");
const multer = require("multer");
const path = require("path");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const Mentor = require("../models/Mentor");

const router = express.Router();

// 📂 Multer storage for mentor photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/mentors/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/**
 * ➕ Step 1: Add Mentor (admin only)
 */
router.post("/", auth, role("admin"), upload.single("photo"), async (req, res) => {
  try {
    const data = req.body;

    if (!data.firstName || !data.email || !data.phone || !data.userId || !data.password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Check duplicates
    const existing = await Mentor.findOne({
      $or: [{ email: data.email }, { userId: data.userId }],
    });
    if (existing) return res.status(400).json({ message: "Email or User ID already exists" });

    // ✅ DO NOT hash here – pre("save") in model handles it
    if (req.file) data.photo = `/uploads/mentors/${req.file.filename}`;

    const mentor = await Mentor.create(data);
    res.json({ message: "Mentor created successfully", mentor });
  } catch (err) {
    res.status(500).json({ message: "Failed to create mentor", error: err.message });
  }
});

/**
 * 🔑 Step 2: Assign / Update Mentor Permissions
 */
router.put("/:id/permissions", auth, role("admin"), async (req, res) => {
  try {
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: "Permissions must be an array" });
    }

    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      { permissions },
      { new: true }
    );

    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    res.json({ message: "Permissions updated successfully", mentor });
  } catch (err) {
    res.status(500).json({ message: "Failed to update permissions", error: err.message });
  }
});

/**
 * 📋 Get all mentors
 */
router.get("/", auth, role("admin"), async (req, res) => {
  try {
    const mentors = await Mentor.find().sort({ createdAt: -1 });
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch mentors" });
  }
});

/**
 * 📌 Get one mentor by ID
 */
router.get("/:id", auth, role("admin"), async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });
    res.json(mentor);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch mentor" });
  }
});

/**
 * ✏️ Update mentor details (re-hash password only if changed)
 */
router.put("/:id", auth, role("admin"), upload.single("photo"), async (req, res) => {
  try {
    const updates = { ...req.body };

    // ✅ Do not hash manually; let pre("save") work when doc.save() is used
    // If you want to hash here, fetch doc then save
    if (req.file) updates.photo = `/uploads/mentors/${req.file.filename}`;

    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    Object.assign(mentor, updates);
    await mentor.save(); // triggers pre("save") if password changed

    res.json({ message: "Mentor updated successfully", mentor });
  } catch (err) {
    res.status(500).json({ message: "Failed to update mentor", error: err.message });
  }
});

/**
 * ❌ Delete mentor
 */
router.delete("/:id", auth, role("admin"), async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndDelete(req.params.id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    res.json({ message: "Mentor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete mentor", error: err.message });
  }
});

module.exports = router;
