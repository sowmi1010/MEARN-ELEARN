const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel", // 👈 dynamic ref
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["User", "Admin", "Student", "Mentor"],
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "readByModel",
      },
    ],
    readByModel: [
      {
        type: String,
        enum: ["User", "Admin", "Student", "Mentor"],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
