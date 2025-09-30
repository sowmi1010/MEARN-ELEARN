const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String }, // stores path to uploaded image
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
