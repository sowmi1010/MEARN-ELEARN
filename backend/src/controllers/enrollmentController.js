const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

/**
 * =====================================
 * Create Enrollment (After Payment)
 * =====================================
 */
exports.createEnrollment = async (req, res) => {
  try {
    const { courseId, paymentId, planType } = req.body;

    if (!courseId || !paymentId || !planType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Calculate expiry
    const startDate = new Date();
    const endDate = new Date(startDate);

    if (planType === "monthly") {
      endDate.setDate(endDate.getDate() + 30);
    } else if (planType === "yearly") {
      endDate.setDate(endDate.getDate() + 365);
    } else {
      return res.status(400).json({ message: "Invalid plan type" });
    }

    // Prevent duplicate enrollment
    const existing = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
      status: "active",
    });

    if (existing) {
      return res.status(409).json({ message: "Already enrolled" });
    }

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
      payment: paymentId,
      planType,
      startDate,
      endDate,
    });

    res.json({
      success: true,
      enrollment,
    });
  } catch (err) {
    console.error("createEnrollment error:", err);
    res.status(500).json({ message: "Enrollment failed" });
  }
};

/**
 * =====================================
 * Get My Enrollments (Student Dashboard)
 * =====================================
 */
exports.myEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user.id,
      status: "active",
    })
      .populate("course")
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (err) {
    console.error("myEnrollments error:", err);
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
};

/**
 * =====================================
 * Expire Enrollment (Manual / Cron)
 * =====================================
 */
exports.expireEnrollment = async (enrollmentId) => {
  await Enrollment.findByIdAndUpdate(enrollmentId, {
    status: "expired",
  });
};
