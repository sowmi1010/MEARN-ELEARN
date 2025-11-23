const users = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ Connected:", socket.id);

    socket.on("joinUser", (userId) => {
      users.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(users.keys()));
    });

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`Joined chat: ${chatId}`);
    });

    socket.on("sendMessage", (data) => {
      io.to(data.chatId).emit("receiveMessage", data);
    });

    socket.on("typing", ({ chatId }) => {
      socket.to(chatId).emit("userTyping");
    });

    socket.on("stopTyping", ({ chatId }) => {
      socket.to(chatId).emit("userStoppedTyping");
    });

    socket.on("messageSeen", ({ chatId, userId }) => {
      socket.to(chatId).emit("messageSeen", { chatId, seenBy: userId });
    });


    socket.on("disconnect", () => {
      for (let [key, value] of users.entries()) {
        if (value === socket.id) users.delete(key);
      }
      io.emit("onlineUsers", Array.from(users.keys()));
      console.log("❌ Disconnected:", socket.id);
    });
  });
};
