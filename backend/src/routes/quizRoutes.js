const express = require("express");
const router = express.Router();
const {
  addQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quizController");
const auth = require("../middlewares/auth");
const checkPermission = require("../middlewares/permission"); // ✅ Added

// 🧩 Add new quiz
router.post("/upload", auth, checkPermission("quizzes"), addQuiz);

// 📋 Get all quizzes (students, mentors, admins)
router.get("/", auth, getQuizzes);

// 🔍 Get single quiz
router.get("/:id", auth, getQuizById);

// ✏️ Update quiz
router.put("/:id", auth, checkPermission("quizzes"), updateQuiz);

// 🗑️ Delete quiz
router.delete("/:id", auth, checkPermission("quizzes"), deleteQuiz);

module.exports = router;
