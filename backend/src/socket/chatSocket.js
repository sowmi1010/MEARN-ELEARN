const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Student = require("../models/Student");
const Mentor = require("../models/Mentor");

// Map of active users: userId → socket.id
const users = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);
    socket.joinedChats = new Set();

    /* ======================================================
       🔹 Global user join (only one socket per user)
    ====================================================== */
    socket.on("joinUser", (userId) => {
      if (!userId) return;

      const existingSocketId = users.get(userId.toString());

      // If user already connected on another socket → remove old one
      if (existingSocketId && existingSocketId !== socket.id) {
        const oldSocket = io.sockets.sockets.get(existingSocketId);
        if (oldSocket) {
          console.log(`⚠️ Replacing old socket for user ${userId}`);
          oldSocket.disconnect(true);
        }
      }

      users.set(userId.toString(), socket.id);
      socket.data.userId = userId.toString();
      console.log(`✅ User joined: ${userId} | Total online: ${users.size}`);

      io.emit("onlineUsers", Array.from(users.keys()));
    });

    /* ======================================================
       🔹 Leave all joined rooms
    ====================================================== */
    socket.on("leaveAllRooms", (data, callback) => {
      for (const room of socket.joinedChats) socket.leave(room);
      socket.joinedChats.clear();
      console.log(`🚪 ${socket.id} left all rooms`);
      if (callback) callback();
    });

    /* ======================================================
       🔹 Join chat room (idempotent)
    ====================================================== */
    socket.on("joinChat", (chatId) => {
      if (!chatId || socket.joinedChats.has(chatId)) return;
      socket.join(chatId);
      socket.joinedChats.add(chatId);
      console.log(`📥 User ${socket.id} joined chat: ${chatId}`);
      
    });

    /* ======================================================
       💬 Send message → Save + broadcast once
    ====================================================== */
    socket.on("sendMessage", async (data) => {
      try {
        const { chatId, senderId, senderModel, text } = data;
        if (!chatId || !senderId || !text) return;

        const message = await Message.create({
          chatId,
          senderId,
          senderModel,
          text,
        });

        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: message._id,
          updatedAt: Date.now(),
        });

        // Populate sender
        const modelMap = { Admin, Mentor, Student, User };
        const Model = modelMap[senderModel] || User;
        const senderData = await Model.findById(senderId).select(
          "name firstName lastName photo profilePic"
        );

        const payload = {
          _id: message._id,
          chatId,
          text,
          createdAt: message.createdAt,
          senderId: senderData,
        };

        io.to(chatId).emit("receiveMessage", payload);
        console.log(`📨 Message broadcast → chat ${chatId}`);
      } catch (err) {
        console.error("Send Message Error:", err.message);
      }
    });

    /* ======================================================
       ✍️ Typing indicator
    ====================================================== */
    socket.on("typing", ({ chatId, senderId }) => {
      if (chatId) socket.to(chatId).emit("userTyping", { chatId, senderId });
    });

    socket.on("stopTyping", ({ chatId, senderId }) => {
      if (chatId)
        socket.to(chatId).emit("userStoppedTyping", { chatId, senderId });
    });

    /* ======================================================
       🔴 Disconnect handler
    ====================================================== */
    socket.on("disconnect", (reason) => {
      const userId = socket.data?.userId;
      if (userId && users.get(userId) === socket.id) {
        users.delete(userId);
        console.log(`❌ User ${userId} disconnected (${reason})`);
      }

      for (const room of socket.joinedChats) socket.leave(room);
      socket.joinedChats.clear();

      io.emit("onlineUsers", Array.from(users.keys()));
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });
};
