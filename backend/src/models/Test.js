const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    // 1️ Group (Root, Stem, etc.)
    group: {
      type: String,
      required: true,
      enum: ["ROOT", "STEM", "LEAF", "FLOWER", "FRUIT", "SEED"],
    },

    // 2️ Standard (e.g., 1st, 2nd, 9th, 12th)
    standard: { type: String, required: true, trim: true },

    // 3️ Board
    board: { type: String, required: true, trim: true },

    // 4️ Language
    language: { type: String, required: true, trim: true },

    // 5️ Subject
    subject: { type: String, required: true, trim: true },

    // 6️ Category (e.g., Unit Test, Revision Test, Model Paper)
    category: { type: String, required: true, trim: true },

    // 7️ Title
    title: { type: String, required: true, trim: true },

    // 8️ Thumbnail (image preview)
    thumbnail: { type: String, required: true },

    // 9️ Test File (PDF)
    file: { type: String, required: true },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
