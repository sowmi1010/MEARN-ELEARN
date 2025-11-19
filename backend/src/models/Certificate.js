const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  pdfPath: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Certificate", certificateSchema);
