module.exports = (io) => {
  const liveNamespace = io.of("/live");

  liveNamespace.on("connection", (socket) => {
    console.log("🔴 Live socket connected:", socket.id);

    socket.on("join-room", ({ roomId, user }) => {
      socket.join(roomId);
      socket.data.user = user;

      liveNamespace.to(roomId).emit("user-joined", {
        id: socket.id,
        user,
      });
    });

    socket.on("signal", ({ roomId, to, data }) => {
      if (to) {
        liveNamespace.to(to).emit("signal", { from: socket.id, data });
      } else {
        socket.to(roomId).emit("signal", { from: socket.id, data });
      }
    });

    socket.on("whiteboard:stroke", ({ roomId, stroke }) => {
      socket.to(roomId).emit("whiteboard:stroke", stroke);
    });

    socket.on("whiteboard:clear", ({ roomId }) => {
      socket.to(roomId).emit("whiteboard:clear");
    });

    socket.on("disconnect", () => {
      console.log("🔴 Live socket disconnected:", socket.id);
    });
  });
};
