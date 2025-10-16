const Quiz = require("../models/Quiz");

//Add Quiz
exports.addQuiz = async (req, res) => {
  try {
    const {
      group,
      standard,
      board,
      language,
      subject,
      lesson,
      question,
      options,
      correctAnswerIndex,
    } = req.body;

    if (!group || !standard || !board || !language || !subject || !question) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    let choices = Array.isArray(options) ? options : JSON.parse(options || "[]");
    if (choices.length !== 4) {
      return res.status(400).json({ message: "Exactly 4 options are required" });
    }

    const quiz = await Quiz.create({
      group,
      standard,
      board,
      language,
      subject,
      lesson,
      question,
      options: choices,
      correctAnswerIndex,
    });

    res.status(201).json({ message: "Quiz added successfully", quiz });
  } catch (err) {
    console.error("addQuiz error:", err);
    res.status(500).json({ message: "Failed to add quiz", error: err.message });
  }
};

//Get All Quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    console.error("getQuizzes error:", err);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};

//Get Single Quiz
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    console.error("❌ getQuizById error:", err);
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
};

//Update Quiz
exports.updateQuiz = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.options && typeof updates.options === "string") {
      updates.options = JSON.parse(updates.options);
    }

    const quiz = await Quiz.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.json({ message: "Quiz updated successfully", quiz });
  } catch (err) {
    console.error("updateQuiz error:", err);
    res.status(500).json({ message: "Failed to update quiz" });
  }
};

// Delete Quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    await quiz.deleteOne();
    res.json({ message: "🗑️ Quiz deleted successfully" });
  } catch (err) {
    console.error("❌ deleteQuiz error:", err);
    res.status(500).json({ message: "Failed to delete quiz" });
  }
};
