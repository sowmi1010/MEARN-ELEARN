const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
    participantModels: [
      {
        type: String,
        enum: ["User", "Admin", "Student", "Mentor"],
        required: true
      }
    ],
    isGroup: { type: Boolean, default: false },
    groupName: { type: String, trim: true },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
