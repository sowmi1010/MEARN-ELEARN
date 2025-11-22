import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../../utils/api";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";

// ✅ Single persistent socket
let socket;
let socketInitialized = false;

export default function ChatWindow() {
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

  /* Scroll down */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ======================================================
     SOCKET INITIALIZATION
  ====================================================== */
  useEffect(() => {
    if (!socketInitialized) {
      socket = io("http://localhost:4000", {
        transports: ["websocket"],
      });

      const uid = currentUser?._id || currentUser?.id;
      if (uid) socket.emit("joinUser", uid);

      socketInitialized = true;
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

        const uniqueMessages = Array.from(
          new Map(msgRes.data.map((m) => [m._id, m])).values()
        );

        setMessages(uniqueMessages);

        socket.emit("leaveAllRooms");
        socket.emit("joinChat", chatRes.data._id);
      } catch (err) {
        console.error("Chat load error:", err.message);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
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
     SOCKET LISTENERS
  ====================================================== */
  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (msg) => {
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
          : "Student";

      socket.emit("sendMessage", {
        chatId,
        senderId: currentUser._id || currentUser.id,
        senderModel,
        text: newMessage,
      });

      setNewMessage("");
    } catch (err) {
      console.error("Send failed:", err.message);
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
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0b0f19] text-white">
        Loading Chat...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0b0f19] text-white">

      {/* ✅ HEADER */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#111827] border-b border-blue-900">

        <div className="flex items-center gap-4">

          <img
            src={
              user?.photo
                ? `http://localhost:4000${user.photo}`
                : "/default-avatar.png"
            }
            className="w-10 h-10 rounded-full border-2 border-blue-500"
            alt=""
          />

          <div>
            <h2 className="font-semibold text-white">
              {user?.firstName
                ? `${user.firstName} ${user.lastName || ""}`
                : user?.name}
            </h2>
            <p className="text-xs text-blue-400">
              {isTyping ? "Typing..." : "Online"}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#0f172a] space-y-4">

        {messages.map((msg) => {
          const isReceived = msg.senderId?._id === userId;

          return (
            <div
              key={msg._id}
              className={`flex ${isReceived ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                  isReceived
                    ? "bg-[#1f2937] text-gray-100"
                    : "bg-blue-600 text-white"
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-[11px] text-gray-300 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <p className="text-gray-400 text-sm">Typing...</p>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* ✅ INPUT */}
      <form
        onSubmit={handleSendMessage}
        className="flex gap-3 p-4 bg-[#111827] border-t border-blue-900"
      >
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 px-5 py-3 rounded-full bg-[#1e293b] border border-blue-600 outline-none"
        />

        <button
          type="submit"
          className="bg-blue-600 px-6 py-3 rounded-full hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}
