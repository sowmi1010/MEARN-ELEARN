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
  const connectedRef = useRef(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const isMyMessage = (msg) => {
    const sender =
      typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
    return sender === currentUser._id;
  };

  /* ======================================================
     SOCKET INIT
  ====================================================== */
  useEffect(() => {
    if (connectedRef.current) return;
    connectedRef.current = true;

    socketRef.current = io("http://localhost:4000", {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      if (currentUser?._id) {
        socketRef.current.emit("joinUser", currentUser._id);
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.off();
    };
  }, []);

  /* ======================================================
     LOAD CHAT
  ====================================================== */
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

        socketRef.current.emit("joinChat", chatRes.data._id);
      } catch (err) {
        console.error("CHAT LOAD ERROR:", err);
      }
    };

    loadChat();
  }, [userId]);

  /* ======================================================
     AUTO SCROLL & SEEN
  ====================================================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    if (chatId) {
      api.post("/chat/seen", { chatId });
      socketRef.current.emit("messageSeen", {
        chatId,
        userId: currentUser._id,
      });
    }
  }, [messages]);

  /* ======================================================
     RECEIVE MESSAGE
  ====================================================== */
  useEffect(() => {
    if (!socketRef.current) return;

    const receiveHandler = (msg) => {
      setMessages((prev) =>
        prev.find((m) => m._id === msg._id) ? prev : [...prev, msg]
      );
    };

    socketRef.current.on("receiveMessage", receiveHandler);

    return () => socketRef.current.off("receiveMessage", receiveHandler);
  }, []);

  /* ======================================================
     SEND TEXT
  ====================================================== */
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      const { data } = await api.post("/chat/message/text", {
        chatId,
        type: "text",
        text: newMessage,
      });

      socketRef.current.emit("sendMessage", data);
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (err) {
      console.error("SEND ERROR:", err);
    }
  };

  /* ======================================================
     SEND IMAGE
  ====================================================== */
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("chatId", chatId);
      fd.append("type", "image");

      const { data } = await api.post("/chat/message/image", fd);

      socketRef.current.emit("sendMessage", data);
      setMessages((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
    }
  };

  /* ======================================================
     FORMAT TIME
  ====================================================== */
  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ======================================================
     UI STARTS — ★ ULTRA MODERN CHAT UI ★
  ====================================================== */
  return (
    <div className="flex flex-col h-[calc(100vh-95px)] bg-gradient-to-br from-[#05080f] to-[#0a0f1d] text-white relative">

      {/* =============== HEADER =============== */}
      <div className="
        flex items-center gap-4 px-6 py-4
        bg-white/5 backdrop-blur-xl
        border-b border-white/10 
        shadow-lg shadow-black/30 sticky top-0 z-20
      ">
        <img
          src={
            user?.photo
              ? `http://localhost:4000${user.photo}`
              : "/default-avatar.png"
          }
          className="
            w-12 h-12 rounded-full object-cover 
            border border-blue-500 shadow-lg shadow-blue-700/40
          "
        />
        <div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {user?.firstName || user?.name}
          </h2>
          <p className="text-xs text-gray-400">Active now</p>
        </div>
      </div>

      {/* =============== MESSAGES =============== */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.map((msg) => {
          const mine = isMyMessage(msg);

          return (
            <div
              key={msg._id}
              className={`flex ${mine ? "justify-end" : "justify-start"} group`}
            >
              <div
                className={`
                  max-w-[70%] px-4 py-3 rounded-2xl shadow-xl
                  backdrop-blur-lg
                  transition-all 
                  ${mine
                    ? "bg-gradient-to-br from-blue-600 to-blue-800 text-right rounded-tr-none"
                    : "bg-white/10 border border-white/10 rounded-tl-none"}
                `}
              >
                {/* TEXT */}
                {msg.type === "text" && (
                  <p className="leading-relaxed tracking-wide">{msg.text}</p>
                )}

                {/* IMAGE */}
                {msg.type === "image" && (
                  <img
                    src={`http://localhost:4000${msg.imageUrl}`}
                    className="rounded-xl max-w-xs mt-2 border border-white/20 shadow-lg"
                  />
                )}

                {/* TIME */}
                <p className="text-[10px] mt-1 text-gray-300">
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* =============== INPUT BAR =============== */}
      <form
        onSubmit={sendMessage}
        className="
          flex items-center gap-3 px-4 py-4 
          bg-white/5 backdrop-blur-md 
          border-t border-white/10 shadow-inner
          sticky bottom-0 z-20
        "
      >
        <FaSmile
          onClick={() => setShowEmoji((p) => !p)}
          className="text-2xl text-yellow-400 cursor-pointer hover:scale-110 transition"
        />

        <FaImage
          onClick={() => fileRef.current.click()}
          className="text-xl text-green-400 cursor-pointer hover:scale-110 transition"
        />
        <input type="file" hidden ref={fileRef} onChange={handleImage} />

        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="
            flex-1 px-4 py-3 rounded-full text-sm
            bg-[#0f1a2b] border border-white/10 
            focus:ring-2 focus:ring-blue-600
            outline-none shadow-inner
          "
        />

        <button
          className="
            bg-gradient-to-r from-blue-500 to-cyan-500 
            px-4 py-3 rounded-full text-black 
            shadow-lg shadow-blue-500/40 
            hover:opacity-90 active:scale-95 transition
          "
        >
          <FaPaperPlane />
        </button>
      </form>

      {/* =============== EMOJI PICKER =============== */}
      {showEmoji && (
        <div className="absolute bottom-24 left-4 z-50 animate-fade-in">
          <Picker
            data={data}
            onEmojiSelect={(e) => setNewMessage((p) => p + e.native)}
            theme="dark"
          />
        </div>
      )}
    </div>
  );
}
