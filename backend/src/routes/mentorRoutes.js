const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");
const User = require("../models/User");
const Payment = require("../models/Payment");

// 🟢 Count students
router.get("/students/count", auth, permission("students"), async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "student" });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 Total payments
router.get("/payments/count", auth, permission("payments"), async (req, res) => {
  try {
    const payments = await Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({ count: payments[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;