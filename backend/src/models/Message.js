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
      refPath: "senderModel",
    },

    senderModel: {
      type: String,
      enum: ["User", "Admin", "Student", "Mentor"],
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "voice"],
      default: "text",
    },

    text: {
      type: String,
      trim: true,
      default: null,
    },

    imageUrl: {
      type: String,
      default: null,
    },

    voiceUrl: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },

    seenAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
