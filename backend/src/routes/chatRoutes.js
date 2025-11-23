const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth");
const chatUpload = require("../middlewares/chatUpload");
const Chat = require("../models/Chat");
const Message = require("../models/Message");


const {
  accessChat,
  sendMessage,
  getMessages,
  markAsSeen,
  getAnyUser,
  deleteMessage,
  editMessage
} = require("../controllers/chatController");

// basic
router.post("/access", protect, accessChat);
router.get("/message/:chatId", protect, getMessages);
router.post("/seen", protect, markAsSeen);

// send
router.post("/message/text", protect, sendMessage);
router.post("/message/image", protect, chatUpload.single("image"), sendMessage);
router.post("/message/voice", protect, chatUpload.single("voice"), sendMessage);

// user
router.get("/user/:id", protect, getAnyUser);

// DELETE MESSAGE
router.delete("/message/:id", protect, deleteMessage);

// EDIT MESSAGE
router.put("/message/:id", protect, editMessage);

router.get("/list", protect, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate({
        path: "participants",
        select: "firstName lastName name photo profilePic",
      })
      .populate({
        path: "lastMessage",
      })
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get("/unread/:chatId", protect, async (req, res) => {
  const count = await Message.countDocuments({
    chatId: req.params.chatId,
    senderId: { $ne: req.user._id },
    status: { $ne: "seen" },
  });

  res.json({ total: count });
});


module.exports = router;
