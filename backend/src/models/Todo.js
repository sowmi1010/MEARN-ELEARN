const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String, // e.g "02", "13"
      required: true,
    },

    month: {
      type: String, // e.g "Jan", "February"
      required: true,
    },

    year: {
      type: String, // e.g "2024"
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
