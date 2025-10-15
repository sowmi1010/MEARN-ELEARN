// backend/src/models/Book.js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    // 1️⃣ Group (Root, Stem, Leaf, etc.)
    group: {
      type: String,
      required: true,
      enum: ["ROOT", "STEM", "LEAF", "FLOWER", "FRUIT", "SEED"],
    },

    // 2️⃣ Standard (e.g., 1st, 2nd, 3rd)
    standard: {
      type: String,
      required: true,
      trim: true,
    },

    // 3️⃣ Board (CBSE, State Board, etc.)
    board: {
      type: String,
      required: true,
      trim: true,
    },

    // 4️⃣ Language (English, Tamil, etc.)
    language: {
      type: String,
      required: true,
      trim: true,
    },

    // 5️⃣ Title of the Book
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // 6️⃣ Optional Subject
    subject: {
      type: String,
      trim: true,
    },

    // 7️⃣ Thumbnail (image path)
    thumbnail: {
      type: String,
      required: true,
    },

    // 8️⃣ File (book PDF or material)
    file: {
      type: String,
      required: true,
    },

    // 9️⃣ Description or about section
    about: {
      type: String,
      trim: true,
    },

    // Optional link to a course
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
