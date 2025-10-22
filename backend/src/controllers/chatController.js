const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Mentor = require("../models/Mentor");
const mongoose = require("mongoose");

// 🧩 Helper: Find user in any collection
async function findAnyUser(userId) {
  return (
    (await Admin.findById(userId).select("name firstName lastName email photo profilePic")) ||
    (await Student.findById(userId).select("firstName lastName email photo profilePic")) ||
    (await Mentor.findById(userId).select("name email photo profilePic")) ||
    (await User.findById(userId).select("name email photo profilePic"))
  );
}

/* ======================================================
   🧩 Create or get existing chat between two users
====================================================== */
exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user?._id;

    if (!userId) return res.status(400).json({ message: "UserId is required" });
    if (!currentUserId) return res.status(401).json({ message: "Unauthorized" });

    const currentUserModel =
      req.user.role === "admin"
        ? "Admin"
        : req.user.role === "mentor"
        ? "Mentor"
        : req.user.role === "student"
        ? "Student"
        : "User";

    const receiver = await findAnyUser(userId);
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    // ✅ Find chat by both participant IDs (flat structure)
    let chat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [currentUserId, userId] },
    })
      .populate("lastMessage")
      .lean();

    // ✅ Create chat if not exists
    if (!chat) {
      chat = await Chat.create({
        participants: [currentUserId, userId],
        participantModel: [currentUserModel, "User"], // you can adjust "User" dynamically if needed
      });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error("🔥 Access Chat Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   🧾 Get all chats for current user
====================================================== */
exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate("participants", "-password")
      .populate({
        path: "lastMessage",
        populate: { path: "senderId", select: "name email photo profilePic" },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    console.error("Get User Chats Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   💬 Send a message (auto-create chat if missing)
====================================================== */
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, text, receiverId } = req.body;
    const senderId = req.user._id;
    const senderModel =
      req.user.role === "admin"
        ? "Admin"
        : req.user.role === "mentor"
        ? "Mentor"
        : req.user.role === "student"
        ? "Student"
        : "User";

    if ((!chatId && !receiverId) || !text) {
      return res.status(400).json({
        message: "Either chatId or receiverId and text are required",
      });
    }

    let chat = null;

    // ✅ Use chatId if given
    if (chatId) chat = await Chat.findById(chatId);

    // ✅ Otherwise find/create chat with receiver
    if (!chat && receiverId) {
      chat =
        (await Chat.findOne({
          isGroup: false,
          participants: { $all: [senderId, receiverId] },
        })) ||
        (await Chat.create({
          participants: [senderId, receiverId],
          participantModel: [senderModel, "User"],
        }));
    }

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // ✅ Create and save message
    const message = await Message.create({
      chatId: chat._id,
      senderId,
      senderModel,
      text,
    });

    chat.lastMessage = message._id;
    await chat.save();

    const populatedMessage = await message.populate(
      "senderId",
      "name email firstName lastName photo profilePic"
    );

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error("Send Message Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   📜 Get all messages for a chat
====================================================== */
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .lean();

    const populated = await Promise.all(
      messages.map(async (msg) => {
        let senderModel;
        if (msg.senderModel === "Admin") senderModel = Admin;
        else if (msg.senderModel === "Mentor") senderModel = Mentor;
        else if (msg.senderModel === "Student") senderModel = Student;
        else senderModel = User;

        const sender = await senderModel
          .findById(msg.senderId)
          .select("firstName lastName name email photo profilePic");

        return { ...msg, senderId: sender };
      })
    );

    res.status(200).json(populated);
  } catch (err) {
    console.error("Get Messages Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   🧠 Get any user by ID (for frontend /chat/user/:id)
====================================================== */
exports.getAnyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findAnyUser(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Get Any User Error:", err);
    res.status(500).json({ message: err.message });
  }
};
