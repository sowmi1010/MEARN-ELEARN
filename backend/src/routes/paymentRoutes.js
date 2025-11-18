const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const checkPermission = require("../middlewares/permission");
const Payment = require("../models/Payment");
const Course = require("../models/Course");

// ---------------------------------------------
// 🔥 DEMO PAYMENT — For Fake/Frontend Courses
// ---------------------------------------------
router.post("/demo-pay", auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID missing" });
    }

    // Amount optional — frontend may not send
    const course = await Course.findById(courseId).catch(() => null);

    const amount = course?.price || 0;

    const payment = await Payment.create({
      user: userId,
      course: courseId,
      provider: "demo",
      providerPaymentId: "DEMO_" + Date.now(),
      amount: amount,
      currency: "INR",
      status: "successful",
    });

    res.json({
      message: "Demo Payment Successful",
      payment,
    });
  } catch (err) {
    console.error("Demo Payment Error:", err);
    res.status(500).json({ message: "Payment failed" });
  }
});

// ---------------------------------------------
// 🔥 GET ALL PAYMENTS (Admin + Mentor with permission)
// ---------------------------------------------
// GET: All payments for Admin / Mentor
router.get("/all", auth, checkPermission("payments"), async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("course", "title");

    // ALWAYS return pure array
    return res.json(payments);
  } catch (err) {
    console.error("Payment fetch error:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});


// ---------------------------------------------
// 🔥 GET MY PAYMENTS (Student Only)
// ---------------------------------------------
// GET MY PAYMENTS (Student Only)
router.get("/my", auth, role("student"), async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate("course", "title price")
      .sort({ createdAt: -1 });

    res.json({ payments });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});


module.exports = router;
