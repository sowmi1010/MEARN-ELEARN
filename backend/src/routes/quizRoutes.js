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
const role = require("../middlewares/role");

// ✅ Routes
router.post("/upload", auth, role("admin"), addQuiz);
router.get("/", auth, getQuizzes);
router.get("/:id", auth, getQuizById);
router.put("/:id", auth, role("admin"), updateQuiz);
router.delete("/:id", auth, role("admin"), deleteQuiz);

module.exports = router;
