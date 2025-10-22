const express = require("express");
const {
  accessChat,
  getUserChats,
  sendMessage,
  getMessages,
  getAnyUser, // 👈 add this
} = require("../controllers/chatController");

const protect = require("../middlewares/auth");
const router = express.Router();

router.post("/access", protect, accessChat);
router.get("/", protect, getUserChats);
router.post("/message", protect, sendMessage);
router.get("/message/:chatId", protect, getMessages);

// 🧠 New route to get user info (used by ChatWindow.jsx)
router.get("/user/:id", protect, getAnyUser);

module.exports = router;
