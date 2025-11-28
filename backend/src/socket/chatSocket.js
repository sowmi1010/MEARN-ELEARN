const users = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ Chat socket connected:", socket.id);

    // JOIN USER
    socket.on("joinUser", (userId) => {
      users.set(userId, socket.id);
      console.log("✅ User joined:", userId);

      io.emit("onlineUsers", Array.from(users.keys()));
    });

    // JOIN CHAT ROOM
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`✅ Joined chat room: ${chatId}`);
    });

    // SEND MESSAGE
    socket.on("sendMessage", (data) => {
      if (!data.chatId) return;
      console.log("📨 Message:", data.text || "image");

      io.to(data.chatId).emit("receiveMessage", data);
    });

    // TYPING
    socket.on("typing", ({ chatId }) => {
      socket.to(chatId).emit("userTyping");
    });

    socket.on("stopTyping", ({ chatId }) => {
      socket.to(chatId).emit("userStoppedTyping");
    });

    // SEEN
    socket.on("messageSeen", ({ chatId, userId }) => {
      socket.to(chatId).emit("messageSeen", { chatId, seenBy: userId });
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      for (let [key, value] of users.entries()) {
        if (value === socket.id) users.delete(key);
      }

      console.log("❌ Disconnected:", socket.id);
      io.emit("onlineUsers", Array.from(users.keys()));
    });
  });
};
