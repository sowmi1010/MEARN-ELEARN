const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Mentor = require("../models/Mentor");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../uploads/mentors");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`),
});
const upload = multer({ storage });

// GET all mentors
router.get("/", async (req, res) => {
  try {
    const mentors = await Mentor.find().select("-password");
    res.json(mentors);
  } catch (err) {
    console.error("GET /api/mentor error:", err);
    res.status(500).json({
      message: "Server error while fetching mentors",
      error: err.message,
    });
  }
});

// GET mentor by ID
router.get("/:id", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id).select("-password");
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });
    res.json(mentor);
  } catch (err) {
    console.error("GET mentor error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST: Create mentor
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { firstName, email, phone, userId, password } = req.body;
    if (!firstName || !email || !userId || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const mentor = new Mentor({
      ...req.body,
      photo: req.file ? `/uploads/mentors/${req.file.filename}` : "",
    });

    await mentor.save();
    res.status(201).json({ message: "Mentor created successfully", mentor });
  } catch (err) {
    console.error("Mentor creation error:", err);
    res.status(400).json({
      message: "Failed to create mentor",
      error: err.message,
    });
  }
});

// PUT: Update mentor
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.photo = `/uploads/mentors/${req.file.filename}`;

    const mentor = await Mentor.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password");

    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    res.json({ message: "Mentor updated successfully", mentor });
  } catch (err) {
    console.error("Mentor update error:", err);
    res.status(400).json({
      message: "Failed to update mentor",
      error: err.message,
    });
  }
});

//PUT: Update Mentor Permissions (fixed)
router.put("/:id/permissions", async (req, res) => {
  try {
    let { permissions } = req.body;

    if (typeof permissions === "string") {
      try {
        permissions = JSON.parse(permissions);
      } catch {
        permissions = permissions.split(",").map((p) => p.trim());
      }
    }

    if (!Array.isArray(permissions)) permissions = [];

    const validModules = [
      "dashboard",
      "home",
      "courses",
      "admin",
      "mentor",
      "students",
      "payments",
    ];
    const cleanPermissions = [...new Set(
      permissions
        .map((p) => p.toLowerCase().trim())
        .filter((p) => validModules.includes(p))
    )];

    // Update mentor and return latest doc
    const updatedMentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      { permissions: cleanPermissions },
      { new: true }
    ).select("-password");

    if (!updatedMentor)
      return res.status(404).json({ message: "Mentor not found" });

    res.json({
      message: "Mentor permissions updated successfully",
      mentor: updatedMentor,
    });
  } catch (err) {
    console.error("Permission update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE: Remove mentor by ID
router.delete("/:id", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // 🧹 Delete mentor photo from server if exists
    if (mentor.photo) {
      const photoPath = path.join(__dirname, "../../", mentor.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlink(photoPath, (err) => {
          if (err) console.warn("Failed to delete photo:", err.message);
        });
      }
    }

    await Mentor.findByIdAndDelete(req.params.id);
    res.json({ message: "Mentor deleted successfully ✅" });
  } catch (err) {
    console.error("Mentor delete error:", err);
    res.status(500).json({
      message: "Failed to delete mentor",
      error: err.message,
    });
  }
});




module.exports = router;
