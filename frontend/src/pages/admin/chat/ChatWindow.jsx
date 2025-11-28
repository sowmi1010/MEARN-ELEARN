import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../../utils/api";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import { FaPaperPlane, FaImage, FaSmile } from "react-icons/fa";

export default function ChatWindow() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileRef = useRef(null);
  const connectedRef = useRef(false); // ✅ IMPORTANT

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  /* ===== MY MESSAGE CHECK ===== */
  const isMyMessage = (msg) => {
    const sender =
      typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
    return sender === currentUser._id;
  };

  /* ================= SOCKET INIT ================= */
  useEffect(() => {
    if (connectedRef.current) return; // ✅ blocks double execution (React StrictMode)
    connectedRef.current = true;

    socketRef.current = io("http://localhost:4000", {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("✅ SOCKET CONNECTED:", socketRef.current.id);
      if (currentUser?._id) {
        socketRef.current.emit("joinUser", currentUser._id);
      }
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ SOCKET DISCONNECTED");
    });

    socketRef.current.on("connect_error", (err) => {
      console.warn("⚠️ Socket error:", err.message);
    });

    return () => {
      // ❌ DO NOT fully destroy during dev refreshes
      if (socketRef.current) {
        socketRef.current.off();
      }
    };
  }, []);

  /* ================= LOAD CHAT ================= */
  useEffect(() => {
    if (!userId) return;

    const loadChat = async () => {
      try {
        const userRes = await api.get(`/chat/user/${userId}`);
        setUser(userRes.data);

        const chatRes = await api.post("/chat/access", { userId });
        setChatId(chatRes.data._id);

        const msgRes = await api.get(`/chat/message/${chatRes.data._id}`);
        setMessages(msgRes.data);

        if (socketRef.current && chatRes.data._id) {
          socketRef.current.emit("joinChat", chatRes.data._id);
          console.log("✅ JOINED ROOM:", chatRes.data._id);
        }
      } catch (err) {
        console.error("CHAT LOAD ERROR:", err);
      }
    };

    loadChat();
  }, [userId]);

  /* ================= SCROLL + SEEN ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    if (chatId && socketRef.current) {
      api.post("/chat/seen", { chatId });

      socketRef.current.emit("messageSeen", {
        chatId,
        userId: currentUser._id,
      });
    }
  }, [messages, chatId]);

  /* ================= RECEIVE MESSAGE ================= */
  useEffect(() => {
    if (!socketRef.current) return;

    const handleReceive = (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socketRef.current.on("receiveMessage", handleReceive);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receiveMessage", handleReceive);
      }
    };
  }, []);

  /* ================= SEND TEXT ================= */
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !chatId || !socketRef.current) return;

    try {
      const { data } = await api.post("/chat/message/text", {
        chatId,
        type: "text",
        text: newMessage,
      });

      socketRef.current.emit("sendMessage", data);

      setMessages((prev) => [...prev, data]);
      setNewMessage("");
      setShowEmoji(false);
    } catch (error) {
      console.error("SEND ERROR:", error);
    }
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !chatId || !socketRef.current) return;

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("chatId", chatId);
      formData.append("type", "image");

      const { data } = await api.post("/chat/message/image", formData);

      socketRef.current.emit("sendMessage", data);
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error("IMAGE ERROR:", error);
    }
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-[#0b0f19] text-white rounded-xl overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center gap-4 px-6 py-4 bg-[#111827] border-b border-blue-900">
        <img
          src={
            user?.photo
              ? `http://localhost:4000${user.photo}`
              : "/default-avatar.png"
          }
          className="w-10 h-10 rounded-full border border-blue-500 object-cover"
        />
        <h2 className="font-bold text-lg">{user?.firstName || user?.name}</h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#0f172a] space-y-4">
        {messages.map((msg) => {
          const mine = isMyMessage(msg);

          return (
            <div
              key={msg._id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                  mine ? "bg-blue-600 text-right" : "bg-[#1f2937] text-left"
                }`}
              >
                {msg.type === "text" && <p>{msg.text}</p>}

                {msg.type === "image" && (
                  <img
                    src={`http://localhost:4000${msg.imageUrl}`}
                    className="rounded-lg max-w-xs mt-2"
                  />
                )}

                <p className="text-xs mt-1 opacity-60">
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-3 px-4 py-3 bg-[#111827] border-t border-blue-900"
      >
        <FaSmile
          onClick={() => setShowEmoji((prev) => !prev)}
          className="cursor-pointer"
        />
        <FaImage
          onClick={() => fileRef.current.click()}
          className="cursor-pointer"
        />
        <input type="file" hidden ref={fileRef} onChange={handleImage} />

        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full bg-[#1e293b] outline-none"
        />

        <button className="text-blue-500">
          <FaPaperPlane />
        </button>
      </form>

      {/* EMOJIS */}
      {showEmoji && (
        <div className="absolute bottom-24 left-6 z-50">
          <Picker
            data={data}
            onEmojiSelect={(e) => setNewMessage((prev) => prev + e.native)}
          />
        </div>
      )}
    </div>
  );
}
