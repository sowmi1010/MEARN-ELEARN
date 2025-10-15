const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    // 1️⃣ Group
    group: {
      type: String,
      required: true,
      enum: ["ROOT", "STEM", "LEAF", "FLOWER", "FRUIT", "SEED"],
    },

    // 2️⃣ Standard
    standard: {
      type: String,
      required: true,
      trim: true,
    },

    // 3️⃣ Board
    board: {
      type: String,
      required: true,
      trim: true,
    },

    // 4️⃣ Language
    language: {
      type: String,
      required: true,
      trim: true,
    },

    // 5️⃣ Subject
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    // 6️⃣ Lesson
    lesson: {
      type: String,
      trim: true,
    },

    // 7️⃣ Question
    question: {
      type: String,
      required: true,
      trim: true,
    },

    // ➕ 4 options
    options: {
      type: [String],
      validate: [(val) => val.length === 4, "Exactly 4 options required"],
    },

    // ✅ Correct Answer Index
    correctAnswerIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
