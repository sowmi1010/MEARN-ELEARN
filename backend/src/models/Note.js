const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    group: {
      type: String,
      required: true,
      enum: ["ROOT", "STEM", "LEAF", "FLOWER", "FRUIT", "SEED"],
    },
    standard: { type: String, required: true, trim: true },
    board: { type: String, required: true, trim: true },
    language: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    lesson: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    videoNumber: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // Always store only relative paths (no D:/ or C:/)
    thumbnail: {
      type: String,
      required: true,
      set: (v) => v?.replace(/\\/g, "/"), // normalize slashes for all OS
    },
    file: {
      type: String,
      required: true,
      set: (v) => v?.replace(/\\/g, "/"),
    },
  },
  { timestamps: true }
);

// Virtual field to return full URLs for frontend
noteSchema.virtual("thumbnailUrl").get(function () {
  return this.thumbnail ? `http://localhost:4000/${this.thumbnail}` : null;
});

noteSchema.virtual("fileUrl").get(function () {
  return this.file ? `http://localhost:4000/${this.file}` : null;
});

// Include virtuals when converting to JSON
noteSchema.set("toJSON", { virtuals: true });
noteSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Note", noteSchema);
