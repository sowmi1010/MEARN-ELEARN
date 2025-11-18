const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

const Payment = require("../models/Payment");
const Video = require("../models/Video");
const Test = require("../models/Test");

/* ============================================
    📌 1. STUDENT PROGRESS (Dashboard)
    GET /api/student-dashboard/progress
=============================================== */
router.get("/progress", auth, role("student"), async (req, res) => {
  try {
    const studentId = req.user.id;

    // Fetch all purchased courses
    const purchases = await Payment.find({
      user: studentId,
      status: "successful",
    }).populate("course", "title");

    const purchasedCourses = purchases.map((p) => ({
      id: p.course?._id,
      title: p.course?.title,
    }));

    return res.json({
      purchasedCourses,
      stats: {
        hours: 0, // Until you track watch time
        videos: 0,
        tests: 0,
      },
      lastWatched: null, // Future update
    });
  } catch (err) {
    console.error("Progress error:", err);
    res.status(500).json({ message: "Failed to load student progress" });
  }
});


/* ============================================
    📌 2. STUDENT PAYMENTS
    GET /api/student-dashboard/payments
=============================================== */
router.get("/payments", auth, role("student"), async (req, res) => {
  try {
    const studentId = req.user.id;

    const payments = await Payment.find({ user: studentId })
      .populate("course", "title price")
      .sort({ createdAt: -1 });

    res.json({ payments });
  } catch (err) {
    console.error("Fetch payments error:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});


/* ============================================
    📌 3. UPCOMING LIVE CLASSES
    GET /api/student-dashboard/live
=============================================== */
router.get("/live", auth, role("student"), async (req, res) => {
  try {
    return res.json([
      {
        title: "Units and Dimensions Part-1",
        time: "5:30 PM",
        teacher: "Physics Dept",
        status: "Upcoming",
      },
      {
        title: "Atoms & Molecules",
        time: "9:00 PM",
        teacher: "Chemistry Dept",
        status: "Upcoming",
      },
    ]);
  } catch (err) {
    res.status(500).json({ message: "Failed to load live classes" });
  }
});

module.exports = router;
