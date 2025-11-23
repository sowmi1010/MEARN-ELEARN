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

// ================= ACCESS CHAT ===================
exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user._id;

    if (!userId)
      return res.status(400).json({ message: "UserId required" });

    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, userId] },
      isGroup: false,
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [currentUserId, userId],
      });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= SEND MESSAGE ===================
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, text, type } = req.body;
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
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= GET MESSAGES ===================
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .populate("senderId", "name firstName lastName photo profilePic");

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
    msg.isEdited = true;

    await msg.save();

    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user._id;

    if (!userId)
      return res.status(400).json({ message: "UserId required" });

    const user = await findAnyUser(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, userId] },
      isGroup: false,
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [currentUserId, userId],
        participantModel: [
          req.user.role === "admin"
            ? "Admin"
            : req.user.role === "student"
            ? "Student"
            : req.user.role === "mentor"
            ? "Mentor"
            : "User",

          user instanceof Admin
            ? "Admin"
            : user instanceof Student
            ? "Student"
            : user instanceof Mentor
            ? "Mentor"
            : "User",
        ],
      });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
