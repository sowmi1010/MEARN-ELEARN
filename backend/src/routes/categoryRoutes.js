const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const auth = require("../middlewares/auth");
const checkPermission = require("../middlewares/permission"); // ✅ Added

/**
 * ✅ Create category
 * (Accessible by Admin or Mentor with “courses” permission)
 */
router.post("/", auth, checkPermission("courses"), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name: name.trim() });
    res.json({ message: "✅ Category created successfully", category });
  } catch (err) {
    console.error("❌ Category create error:", err);
    res.status(500).json({ message: "Failed to create category" });
  }
});

/**
 * ✅ List all categories (Public)
 */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.error("❌ Fetch categories error:", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

module.exports = router;
