const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    lesson: { type: String }, // optional
    description: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    filePath: { type: String, required: true }, // ✅ local path of uploaded video
    duration: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
