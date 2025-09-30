const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },   // e.g. "Maths", "Tamil & Maths"
    comment: { type: String, required: true, trim: true, maxlength: 1200 },
    photo: { type: String, default: "" },                   // "/uploads/feedback/<file>"
    // optional flags
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
