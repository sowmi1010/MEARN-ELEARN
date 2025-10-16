// models/CourseGroup.js
const mongoose = require("mongoose");

const courseGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, 
  description: { type: String },
  range: { type: String },
  category: { type: String }, 
  image: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model("CourseGroup", courseGroupSchema);
