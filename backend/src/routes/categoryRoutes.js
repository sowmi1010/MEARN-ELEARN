const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// ✅ Create category (Admin)
router.post("/", auth, role("admin"), async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ List all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
