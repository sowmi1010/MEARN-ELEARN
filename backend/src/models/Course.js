const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    price: { type: Number, default: 0 },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
