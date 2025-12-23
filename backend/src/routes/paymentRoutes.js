const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const checkPermission = require("../middlewares/permission");

const Payment = require("../models/Payment");
const Course = require("../models/Course");
const mongoose = require("mongoose");


const Enrollment = require("../models/Enrollment");

router.post("/demo-pay", auth, async (req, res) => {
  try {
    const {
      courseId,
      title,
      price,
      group,
      standard,
      board,
      language,
      groupCode,
      planType = "monthly", // ✅ DEFAULT
    } = req.body;

    const userId = req.user.id;

    if (!title || !price) {
      return res.status(400).json({ message: "Title or Price missing" });
    }

    const course = mongoose.Types.ObjectId.isValid(courseId)
      ? await Course.findById(courseId)
      : null;

    // ✅ SAVE PAYMENT
    const payment = await Payment.create({
      user: userId,
      course: course ? course._id : null,
      provider: "demo",
      providerPaymentId: "DEMO_" + Date.now(),
      amount: Number(price),
      status: "successful",
      metadata: {
        title,
        group,
        standard,
        board,
        language,
        groupCode,
        planType,
      },
    });

    // ✅ CALCULATE DATES
    const startDate = new Date();
    const endDate = new Date(startDate);

    if (planType === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // ✅ CREATE ENROLLMENT (THIS WAS FAILING)
    await Enrollment.create({
      student: userId,
      course: course ? course._id : null,
      payment: payment._id,
      planType,
      startDate,
      endDate, // ✅ REQUIRED FIELD
    });

    res.json({
      message: "Demo Payment Successful",
      payment,
    });

  } catch (err) {
    console.error("Payment Error =>", err);
    res.status(500).json({ message: err.message });
  }
});



// ---------------------------------------------
// 🔥 GET ALL PAYMENTS (Admin + Mentor)
// ---------------------------------------------
router.get("/all", auth, checkPermission("payments"), async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.error("Payment fetch error:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});


// ---------------------------------------------
// 🔥 GET MY PAYMENTS (Student Only)
// ---------------------------------------------
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
