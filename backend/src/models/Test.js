const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    // 1️⃣ Group (Root, Stem, etc.)
    group: {
      type: String,
      required: true,
      enum: ["ROOT", "STEM", "LEAF", "FLOWER", "FRUIT", "SEED"],
    },

    // 2️⃣ Standard (e.g., 1st, 2nd, 9th, 12th)
    standard: { type: String, required: true, trim: true },

    // 3️⃣ Board
    board: { type: String, required: true, trim: true },

    // 4️⃣ Language
    language: { type: String, required: true, trim: true },

    // 5️⃣ Subject
    subject: { type: String, required: true, trim: true },

    // 6️⃣ Category (e.g., Unit Test, Revision Test, Model Paper)
    category: { type: String, required: true, trim: true },

    // 7️⃣ Title
    title: { type: String, required: true, trim: true },

    // 8️⃣ Thumbnail (image preview)
    thumbnail: { type: String, required: true },

    // 9️⃣ Test File (PDF)
    file: { type: String, required: true },

    // 🕒 Timestamps
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
