// backend/models/Chat.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    // Admin / Student / Mentor / User IDs
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "participantModels",      // 🔥 dynamic model
        required: true,
      },
    ],

    // Each index matches participants[index]
    participantModels: [
      {
        type: String,
        enum: ["User", "Admin", "Student", "Mentor"],
        required: true,
      },
    ],

    isGroup: { type: Boolean, default: false },
    groupName: { type: String, trim: true },

    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
