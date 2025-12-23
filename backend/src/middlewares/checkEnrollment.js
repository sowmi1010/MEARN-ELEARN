const Enrollment = require("../models/Enrollment");

/**
 * Middleware to check if user is enrolled
 * and enrollment is active (not expired)
 */
module.exports = async function checkEnrollment(req, res, next) {
  try {
    const userId = req.user.id;

    // courseId can come from params OR query OR body
    const courseId =
      req.params.courseId ||
      req.query.courseId ||
      req.body.courseId;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId,
      status: "active",
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You are not enrolled in this course",
      });
    }

    // Check expiry
    if (new Date() > enrollment.endDate) {
      enrollment.status = "expired";
      await enrollment.save();

      return res.status(403).json({
        message: "Your subscription has expired",
      });
    }

    // Attach enrollment to request (optional but useful)
    req.enrollment = enrollment;

    next();
  } catch (err) {
    console.error("checkEnrollment error:", err);
    res.status(500).json({ message: "Enrollment check failed" });
  }
};
