// backend/src/models/Video.js
const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    // 1️ Group (Root, Stem, Leaf, etc.)
    group: {
      type: String,
      required: true,
      enum: ["ROOT", "STEM", "LEAF", "FLOWER", "FRUIT", "SEED"],
    },

    // 2️ Standard (e.g., 1st to 4th)
    standard: {
      type: String,
      required: true,
      trim: true,
    },

    // 3️ Board (e.g., CBSE, State)
    board: {
      type: String,
      required: true,
      trim: true,
    },

    // 4️ Language (e.g., English, Tamil)
    language: {
      type: String,
      required: true,
      trim: true,
    },

    // 5️ Subject (e.g., Maths, Science)
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    // 6️ Lesson (e.g., Chapter 1: Numbers)
    lesson: {
      type: String,
      required: true,
      trim: true,
    },

    // 7️ Category (e.g., Foundation, Revision)
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // 8️ Video Number (like V-001)
    videoNumber: {
      type: String,
      trim: true,
    },

    // 9️ Title of the video
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // 10 About Course (short video description)
    aboutCourse: {
      type: String,
      trim: true,
    },

    // 11️ Thumbnail (image file path or URL)
    thumbnail: {
      type: String,
      required: true,
    },

    // 12️ Video file path
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
