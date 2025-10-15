// backend/routes/courseRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const checkPermission = require("../middlewares/permission"); // ✅ Added

const {
  createCourse,
  listCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const Course = require("../models/Course");
const User = require("../models/User");
const Student = require("../models/Student");

/**
 * ==========================
 * ✅ Public: List all courses
 * ==========================
 */
router.get("/", listCourses);

/**
 * ==========================================================
 * ✅ Admin or Mentor(with "students" permission): View enrolled students
 * ==========================================================
 */
router.get("/:id/students", auth, async (req, res) => {
  try {
    const user = req.user;

    if (
      user.role !== "admin" &&
      !(user.role === "mentor" && user.permissions?.includes("students"))
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const course = await Course.findById(req.params.id).populate(
      "enrolledStudents",
      "name email createdAt"
    );

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course.enrolledStudents);
  } catch (err) {
    console.error("❌ Fetch students error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * ==========================
 * ✅ Authenticated: Get single course details
 * ==========================
 */
router.get("/:id", auth, getCourse);

/**
 * ==========================
 * ✅ Admin or Mentor(with "courses" permission): Create a course
 * ==========================
 */
router.post("/", auth, checkPermission("courses"), createCourse);

/**
 * ==========================
 * ✅ Admin or Mentor(with "courses" permission): Update a course
 * ==========================
 */
router.put("/:id", auth, checkPermission("courses"), updateCourse);

/**
 * ==========================
 * ✅ Admin or Mentor(with "courses" permission): Delete a course
 * ==========================
 */
router.delete("/:id", auth, checkPermission("courses"), deleteCourse);

/**
 * ==========================================================
 * ✅ Student: Enroll in a course (works for both User + Student)
 * ==========================================================
 */
router.post("/:id/enroll", auth, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!Array.isArray(course.enrolledStudents)) {
      course.enrolledStudents = [];
    }

    const alreadyEnrolled = course.enrolledStudents.some(
      (s) => s && s.toString() === userId.toString()
    );
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.enrolledStudents.push(userId);
    await course.save();

    let updated = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    );

    if (!updated) {
      updated = await Student.findByIdAndUpdate(
        userId,
        { $addToSet: { enrolledCourses: courseId } },
        { new: true }
      );
    }

    if (!updated) {
      return res
        .status(404)
        .json({ message: "User/Student not found to update enrollment" });
    }

    res.json({ message: "✅ Enrolled successfully!", courseId });
  } catch (err) {
    console.error("❌ ENROLL SERVER ERROR >>>", err);
    res.status(500).json({ message: "Failed to enroll", error: err.message });
  }
});

module.exports = router;
