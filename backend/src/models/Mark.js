const mongoose = require("mongoose");

const markSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    group: { type: String, required: true },
    standard: { type: String, required: true },
    subject: { type: String, required: true },

    testName: { type: String, required: true },

    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true },

    percentage: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mark", markSchema);
