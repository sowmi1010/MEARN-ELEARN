import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { io } from "socket.io-client";

// ✅ Single persistent socket
let socket;
let socketInitialized = false;

const ChatWindow = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ======================================================
     SOCKET INITIALIZATION (once)
  ====================================================== */
  useEffect(() => {
    if (!socketInitialized) {
      socket = io("http://localhost:4000", {
        transports: ["websocket"],
        reconnection: true,
      });

      const uid = currentUser?._id || currentUser?.id;
      if (uid) socket.emit("joinUser", uid);

      socketInitialized = true;
      console.log("🟢 Global socket initialized");
    }
  }, [currentUser]);

  /* ======================================================
     LOAD CHAT + JOIN ROOM
  ====================================================== */
  useEffect(() => {
    let active = true;

    const loadChat = async () => {
      setLoading(true);
      try {
        const userRes = await api.get(`/chat/user/${userId}`);
        if (!active) return;
        setUser(userRes.data);

        const chatRes = await api.post("/chat/access", { userId });
        if (!active) return;
        setChatId(chatRes.data._id);

        const msgRes = await api.get(`/chat/message/${chatRes.data._id}`);
        if (!active) return;

        // ✅ Deduplicate messages by _id
        const uniqueMessages = Array.from(
          new Map(msgRes.data.map((m) => [m._id, m])).values()
        );

        setMessages(uniqueMessages);

        // join the chat room
        socket.emit("leaveAllRooms");
        socket.emit("joinChat", chatRes.data._id);
        console.log("📥 Joined chat:", chatRes.data._id);
      } catch (err) {
        console.error("Chat load error:", err.message);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          alert("Session expired. Please log in again.");
          navigate("/login");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadChat();

    return () => {
      active = false;
      socket.emit("leaveAllRooms");
    };
  }, [userId, navigate]);

  /* ======================================================
     SOCKET LISTENERS (deduplicated)
  ====================================================== */
  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (msg) => {
      // ✅ Avoid duplication after refresh or rejoin
      setMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    const handleTyping = ({ senderId }) => {
      if (senderId === userId) setIsTyping(true);
    };

    const handleStopTyping = ({ senderId }) => {
      if (senderId === userId) setIsTyping(false);
    };

    socket.off("receiveMessage").on("receiveMessage", handleIncoming);
    socket.off("userTyping").on("userTyping", handleTyping);
    socket.off("userStoppedTyping").on("userStoppedTyping", handleStopTyping);

    console.log("✅ Socket listeners attached");

    return () => {
      socket.off("receiveMessage", handleIncoming);
      socket.off("userTyping", handleTyping);
      socket.off("userStoppedTyping", handleStopTyping);
    };
  }, [userId]);

  /* ======================================================
     SEND MESSAGE
  ====================================================== */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    try {
      await api.post("/chat/message", { chatId, text: newMessage });

      const senderModel =
        currentUser.role === "admin"
          ? "Admin"
          : currentUser.role === "mentor"
          ? "Mentor"
          : currentUser.role === "student"
          ? "Student"
          : "User";

      socket.emit("sendMessage", {
        chatId,
        senderId: currentUser._id || currentUser.id,
        senderModel,
        text: newMessage,
      });

      setNewMessage("");
    } catch (err) {
      console.error("Send message failed:", err.message);
    }
  };

  /* ======================================================
     TYPING INDICATOR
  ====================================================== */
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!chatId) return;

    socket.emit("typing", {
      chatId,
      senderId: currentUser._id || currentUser.id,
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        chatId,
        senderId: currentUser._id || currentUser.id,
      });
    }, 2000);
  };

  /* ======================================================
     UI
  ====================================================== */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0b0f19] text-white">
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#0b0f19] text-white h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#111827] p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          {user && (
            <>
              <img
                src={
                  user.photo
                    ? `http://localhost:4000${user.photo}`
                    : "/default-avatar.png"
                }
                alt="profile"
                className="w-10 h-10 rounded-full border border-gray-500 object-cover"
              />
              <div>
                <h2 className="font-semibold">
                  {user.firstName
                    ? `${user.firstName} ${user.lastName || ""}`
                    : user.name}
                </h2>
                <p className="text-sm text-gray-400">
                  {isTyping
                    ? "Typing..."
                    : `Online • ${new Date().toLocaleTimeString()}`}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0f172a]">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isReceived = msg.senderId?._id === userId;
            return (
              <div
                key={msg._id}
                className={`flex ${
                  isReceived ? "justify-start" : "justify-end"
                }`}
              >
                <div className="flex items-end gap-2">
                  {isReceived && (
                    <img
                      src={
                        msg.senderId?.photo
                          ? `http://localhost:4000${msg.senderId.photo}`
                          : "/default-avatar.png"
                      }
                      alt="sender"
                      className="w-8 h-8 rounded-full border border-gray-600"
                    />
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-xs ${
                      isReceived
                        ? "bg-gray-700 text-gray-100"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {msg.text}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400 text-sm">
            No messages yet. Start the conversation 👋
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-3 p-4 bg-[#111827] border-t border-gray-700"
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={handleTyping}
          className="flex-1 bg-[#1e293b] text-white px-4 py-2 rounded-full outline-none border border-gray-600 focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
