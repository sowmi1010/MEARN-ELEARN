const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "participantModel",
        required: true,
      },
    ],
    participantModel: [
      {
        type: String,
        required: true,
        enum: ["User", "Admin", "Student", "Mentor"],
      },
    ],
    isGroup: { type: Boolean, default: false },
    groupName: { type: String, trim: true },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
