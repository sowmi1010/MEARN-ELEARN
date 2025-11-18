const mongoose = require("mongoose");

const liveSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    teacher: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    thumbnail: { type: String },
    meetingLink: { type: String },
    group: { type: String },
    standard: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Live", liveSchema);
