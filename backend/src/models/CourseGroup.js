// models/CourseGroup.js
const mongoose = require("mongoose");

const courseGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Root, Stem, Leaf, etc.
  description: { type: String },
  range: { type: String }, // "1st to 4th Standard"
  category: { type: String }, // Foundation, Government Exam, etc.
  image: { type: String }, // Group thumbnail
}, { timestamps: true });

module.exports = mongoose.model("CourseGroup", courseGroupSchema);
