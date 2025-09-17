const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const {
  createCourse,
  listCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const Course = require("../models/Course");
const User = require("../models/User");

// Public: list all courses
router.get("/", listCourses);

// Admin only: get students of a course (⚡ must come BEFORE /:id)
router.get("/:id/students", auth, role("admin"), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "enrolledStudents",
      "name email createdAt"
    );
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course.enrolledStudents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Authenticated: get single course details
router.get("/:id", auth, getCourse);

// Admin only: create a course
router.post("/", auth, role("admin"), createCourse);

// Admin only: update a course
router.put("/:id", auth, role("admin"), updateCourse);

// Admin only: delete a course
router.delete("/:id", auth, role("admin"), deleteCourse);

// Student: enroll in a course
router.post("/:id/enroll", auth, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Avoid duplicate enrollments (⚡ safer check)
    if (course.enrolledStudents.some(s => s.toString() === userId)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    // Add user to course
    course.enrolledStudents.push(userId);
    await course.save();

    // Add course to user
    await User.findByIdAndUpdate(userId, {
      $push: { enrolledCourses: courseId },
    });

    res.json({ message: "Enrolled successfully", courseId });
  } catch (err) {
    console.error("Enroll error:", err);
    res.status(500).json({ message: "Failed to enroll", error: err.message });
  }
});

module.exports = router;
