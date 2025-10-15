const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const auth = require("../middlewares/auth");
const checkPermission = require("../middlewares/permission"); // ✅ Added
const Feedback = require("../models/Feedback");

// 📂 Ensure upload dir exists
const uploadDir = path.join(__dirname, "../../uploads/feedback");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 Created folder: uploads/feedback");
}

// 📤 Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

/**
 * ============================
 * PUBLIC: list feedbacks
 * GET /api/feedbacks
 * Query support: ?active=true&featured=true&limit=6
 * ============================
 */
router.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.active === "true") query.isActive = true;
    if (req.query.featured === "true") query.featured = true;

    const limit = parseInt(req.query.limit || "0", 10);
    const docs = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(docs);
  } catch (err) {
    console.error("❌ feedback list error:", err);
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
});

/**
 * ============================
 * ADMIN / MENTOR (with access): create feedback
 * ============================
 */
router.post(
  "/",
  auth,
  checkPermission("feedbacks"), // ✅ Changed
  upload.single("photo"),
  async (req, res) => {
    try {
      const { name, course, comment, isActive, featured } = req.body;

      if (!name || !course || !comment) {
        return res.status(400).json({
          message: "Name, course, and comment are required",
        });
      }

      const doc = await Feedback.create({
        name,
        course,
        comment,
        isActive: isActive !== undefined ? isActive : true,
        featured: featured === "true",
        photo: req.file ? `/uploads/feedback/${req.file.filename}` : "",
      });

      res.json({ message: "✅ Feedback created", feedback: doc });
    } catch (err) {
      console.error("❌ feedback create error:", err);
      res.status(500).json({ message: "Failed to create feedback" });
    }
  }
);

/**
 * ============================
 * ADMIN / MENTOR (with access): update feedback
 * ============================
 */
router.put(
  "/:id",
  auth,
  checkPermission("feedbacks"), // ✅ Changed
  upload.single("photo"),
  async (req, res) => {
    try {
      const { name, course, comment, isActive, featured } = req.body;

      const updates = { name, course, comment };
      if (typeof isActive !== "undefined")
        updates.isActive = isActive === "true" || isActive === true;
      if (typeof featured !== "undefined")
        updates.featured = featured === "true" || featured === true;

      if (req.file) {
        updates.photo = `/uploads/feedback/${req.file.filename}`;
      }

      const prev = await Feedback.findById(req.params.id);
      if (!prev)
        return res.status(404).json({ message: "Feedback not found" });

      if (req.file && prev.photo) {
        const oldPath = path.join(__dirname, "..", "..", prev.photo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const updated = await Feedback.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
      );
      res.json({ message: "✅ Feedback updated", feedback: updated });
    } catch (err) {
      console.error("❌ feedback update error:", err);
      res.status(500).json({ message: "Failed to update feedback" });
    }
  }
);

/**
 * ============================
 * ADMIN / MENTOR (with access): delete feedback
 * ============================
 */
router.delete(
  "/:id",
  auth,
  checkPermission("feedbacks"), // ✅ Changed
  async (req, res) => {
    try {
      const doc = await Feedback.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: "Feedback not found" });

      if (doc.photo) {
        const filePath = path.join(__dirname, "..", "..", doc.photo);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      await doc.deleteOne();
      res.json({ message: "🗑️ Feedback deleted" });
    } catch (err) {
      console.error("❌ feedback delete error:", err);
      res.status(500).json({ message: "Failed to delete feedback" });
    }
  }
);

module.exports = router;
