// backend/src/models/Video.js
const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    // 1️⃣ Group (Root, Stem, Leaf, etc.)
    group: {
      type: String,
      required: true,
      enum: ["ROOT", "STEM", "LEAF", "FLOWER", "FRUIT", "SEED"],
    },

    // 2️⃣ Standard (e.g., 1st to 4th)
    standard: {
      type: String,
      required: true,
      trim: true,
    },

    // 3️⃣ Board (e.g., CBSE, State)
    board: {
      type: String,
      required: true,
      trim: true,
    },

    // 4️⃣ Language (e.g., English, Tamil)
    language: {
      type: String,
      required: true,
      trim: true,
    },

    // 5️⃣ Subject (e.g., Maths, Science)
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    // 6️⃣ Lesson (e.g., Chapter 1: Numbers)
    lesson: {
      type: String,
      required: true,
      trim: true,
    },

    // 7️⃣ Category (e.g., Foundation, Revision)
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // 8️⃣ Video Number (like V-001)
    videoNumber: {
      type: String,
      trim: true,
    },

    // 9️⃣ Title of the video
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔟 About Course (short video description)
    aboutCourse: {
      type: String,
      trim: true,
    },

    // 11️⃣ Thumbnail (image file path or URL)
    thumbnail: {
      type: String,
      required: true,
    },

    // 12️⃣ Video file path
    file: {
      type: String,
      required: true,
    },

    // Optional: link to Course for enrolled mapping
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
