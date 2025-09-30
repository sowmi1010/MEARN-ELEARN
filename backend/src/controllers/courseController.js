// backend/controllers/courseController.js
const Course = require("../models/Course");

/**
 * ========================
 * ✅ Get all courses (Public)
 * ========================
 */
exports.listCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher", "name email role")
      .populate("videos", "title duration")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    console.error("❌ listCourses error:", err.message);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

/**
 * ========================
 * ✅ Get a single course
 *    - All logged-in users can view details
 *    - Videos still require enrollment
 * ========================
 */
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("videos", "title description")
      .populate("enrolledStudents", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 🟢 Allow all authenticated users to view course details
    res.json(course);
  } catch (err) {
    console.error("❌ getCourse error:", err.message);
    res.status(500).json({ message: "Failed to fetch course" });
  }
};

/**
 * ========================
 * ✅ Create a new course
 * ========================
 */
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and category are required" });
    }

    const course = await Course.create({
      title,
      description,
      category,
      price,
      teacher: req.user.id, // logged-in admin
    });

    res.json({ message: "🎉 Course created successfully", course });
  } catch (err) {
    console.error("❌ createCourse error:", err.message);
    res.status(500).json({ message: "Failed to create course" });
  }
};

/**
 * ========================
 * ✅ Update course
 * ========================
 */
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, category, price },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "✅ Course updated successfully", course: updated });
  } catch (err) {
    console.error("❌ updateCourse error:", err.message);
    res.status(500).json({ message: "Failed to update course" });
  }
};

/**
 * ========================
 * ✅ Delete course
 * ========================
 */
exports.deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "🗑️ Course deleted successfully" });
  } catch (err) {
    console.error("❌ deleteCourse error:", err.message);
    res.status(500).json({ message: "Failed to delete course" });
  }
};
