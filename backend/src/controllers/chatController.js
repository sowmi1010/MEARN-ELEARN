// backend/controllers/chatController.js
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Mentor = require("../models/Mentor");

// ================= FIND USER ANY =================
async function findAnyUser(userId) {
  return (
    (await Admin.findById(userId)) ||
    (await Student.findById(userId)) ||
    (await Mentor.findById(userId)) ||
    (await User.findById(userId))
  );
}

// ================= ACCESS CHAT (create if not exists) ===================
exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user._id;

    if (!userId) {
      return res.status(400).json({ message: "UserId required" });
    }

    const otherUser = await findAnyUser(userId);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1) Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, userId] },
      isGroup: false,
    });

    // 2) If not, create new
    if (!chat) {
      // current user model from token
      const meModel =
        req.user.role === "admin"
          ? "Admin"
          : req.user.role === "student"
            ? "Student"
            : req.user.role === "mentor"
              ? "Mentor"
              : "User";

      // other user model using instance
      const otherModel =
        otherUser instanceof Admin
          ? "Admin"
          : otherUser instanceof Student
            ? "Student"
            : otherUser instanceof Mentor
              ? "Mentor"
              : "User";

      chat = await Chat.create({
        participants: [currentUserId, userId],
        participantModels: [meModel, otherModel],
      });
    }

    res.json(chat);
  } catch (err) {
    console.error("accessChat error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= SEND MESSAGE ===================
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, text, type, replyTo } = req.body;
    const senderId = req.user._id;

    if (!chatId) {
      return res.status(400).json({ message: "ChatId required" });
    }

    const senderModel =
      req.user.role === "admin"
        ? "Admin"
        : req.user.role === "mentor"
          ? "Mentor"
          : req.user.role === "student"
            ? "Student"
            : "User";

    let imageUrl = null;
    let voiceUrl = null;

    if (type === "image" && req.file) {
      imageUrl = `/uploads/chat/images/${req.file.filename}`;
    }

    if (type === "voice" && req.file) {
      voiceUrl = `/uploads/chat/voices/${req.file.filename}`;
    }

    const message = await Message.create({
      chatId,
      senderId,
      senderModel,
      type,
      text: type === "text" ? text : null,
      imageUrl,
      voiceUrl,
      status: "delivered",
      // optional fields – add to Message schema if not there
      replyTo: replyTo || null,
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    res.json(message);
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= GET MESSAGES ===================
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });


    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= MARK AS SEEN ===================
exports.markAsSeen = async (req, res) => {
  try {
    const { chatId } = req.body;
    const userId = req.user._id;

    await Message.updateMany(
      {
        chatId,
        senderId: { $ne: userId },
      },
      {
        status: "seen",
        seenAt: new Date(),
      }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET USER INFO ===================
exports.getAnyUser = async (req, res) => {
  try {
    let user = await findAnyUser(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      firstName: user.firstName || user.name,
      lastName: user.lastName || "",
      photo: user.photo || user.profilePic || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE MESSAGE ===================
exports.deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);

    if (!msg) return res.status(404).json({ message: "Message not found" });

    if (msg.senderId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed" });

    await msg.deleteOne();

    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= EDIT MESSAGE ===================
exports.editMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const msg = await Message.findById(req.params.id);

    if (!msg) return res.status(404).json({ message: "Message not found" });

    if (msg.senderId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed" });

    msg.text = text;
    msg.isEdited = true; // make sure Message schema has this

    await msg.save();

    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
