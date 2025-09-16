// backend/src/controllers/courseController.js
const Course = require("../models/Course");

// Create new course
const createCourse = async (req, res) => {
  try {
        console.log("🔑 Authenticated user:", req.user); // 👈 debug log
    const { title, description, category, price } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and category are required" });
    }

    const course = await Course.create({
      title,
      description,
      category,
      price,
      teacher: req.user._id, // ✅ works now
    });

    res.json(course);
  } catch (err) {
    console.error("❌ Course creation error:", err.message);
    res.status(500).json({ message: "Failed to create course", error: err.message });
  }
};

const listCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name email role");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: "videos",
      options: { sort: { lesson: 1 } },
    });

    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, category, price },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update course" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "✅ Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete course" });
  }
};

module.exports = { createCourse, listCourses, getCourse, updateCourse, deleteCourse };
