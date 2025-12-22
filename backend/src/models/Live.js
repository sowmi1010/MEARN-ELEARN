const mongoose = require("mongoose");

const liveSchema = new mongoose.Schema(
  {
    group: { type: String, required: true },
    standard: { type: String, required: true },
    groupCode: { type: String },

    board: { type: String },
    language: { type: String },
    subject: { type: String, required: true },

    category: { type: String },
    title: { type: String, required: true },
    description: { type: String },

    date: { type: Date, required: true },
    time: { type: String, required: true },

    thumbnail: { type: String },

    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Live", liveSchema);
