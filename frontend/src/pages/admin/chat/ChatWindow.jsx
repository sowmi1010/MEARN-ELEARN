import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../../utils/api";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import {
  FaPaperPlane,
  FaImage,
  FaSmile,
  FaReply,
  FaTrash,
  FaEdit,
  FaTimes,
} from "react-icons/fa";

let socket;

export default function ChatWindow() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [showEmoji, setShowEmoji] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editMsg, setEditMsg] = useState(null);

  const messagesEndRef = useRef(null);
  const fileRef = useRef(null);
  const emojiRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  /* AUTO SCROLL + SEEN */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    if (chatId) {
      api.post("/chat/seen", { chatId });
      socket.emit("messageSeen", { chatId, userId: currentUser._id });
    }
  }, [messages]);

  /* SOCKET INIT */
  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:4000", { transports: ["websocket"] });

      if (currentUser?._id) {
        socket.emit("joinUser", currentUser._id);
      }
    }
  }, []);

  /* LOAD CHAT */
  useEffect(() => {
    const load = async () => {
      try {
        const userRes = await api.get(`/chat/user/${userId}`);
        setUser(userRes.data);

        const chatRes = await api.post("/chat/access", { userId });
        setChatId(chatRes.data._id);

        const msgRes = await api.get(`/chat/message/${chatRes.data._id}`);
        setMessages(msgRes.data);

        socket.emit("joinChat", chatRes.data._id);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [userId]);

  /* REALTIME LISTEN */
  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (msg) => {
      if (
        msg.senderId === currentUser._id ||
        msg.senderId?._id === currentUser._id
      )
        return;

      setMessages((prev) => [...prev, msg]);
    });

    socket.on("messageSeen", () => {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId?._id === currentUser._id
            ? { ...m, status: "seen", seenAt: new Date() }
            : m
        )
      );
    });

    return () => socket.off();
  }, []);

  /* EMOJI CLOSE ON OUTSIDE CLICK */
  useEffect(() => {
    const handleClick = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* SEND MESSAGE */
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage || !chatId) return;

    if (editMsg) {
      const { data } = await api.put(`/chat/message/${editMsg._id}`, {
        text: newMessage,
      });

      setMessages((prev) =>
        prev.map((m) => (m._id === editMsg._id ? data : m))
      );
      setEditMsg(null);
      setNewMessage("");
      return;
    }

    const { data } = await api.post("/chat/message/text", {
      chatId,
      type: "text",
      text: newMessage,
      replyTo: replyTo?._id || null,
    });

    socket.emit("sendMessage", data);
    setMessages((prev) => [...prev, data]);

    setNewMessage("");
    setReplyTo(null);
    setShowEmoji(false);
  };

  /* IMAGE */
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !chatId) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("chatId", chatId);
    formData.append("type", "image");

    const { data } = await api.post("/chat/message/image", formData);

    socket.emit("sendMessage", data);
    setMessages((prev) => [...prev, data]);
  };

  /* DELETE */
  const deleteMessage = async (id) => {
    await api.delete(`/chat/message/${id}`);
    setMessages((prev) => prev.filter((m) => m._id !== id));
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-[#0b0f19] text-white rounded-xl overflow-hidden relative">
      {/* HEADER */}
      <div className="flex items-center gap-4 px-6 py-4 bg-[#111827] border-b border-blue-900">
        <img
          src={
            user?.photo
              ? `http://localhost:4000${user.photo}`
              : "/default-avatar.png"
          }
          className="w-10 h-10 rounded-full border border-blue-500"
        />
        <h2 className="font-bold text-lg">{user?.firstName || user?.name}</h2>
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-scroll px-6 py-4 bg-[#0f172a] space-y-6">
        {messages.map((msg) => {
          const mine = msg.senderId?._id === currentUser._id;

          return (
            <div
              key={msg._id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`group max-w-sm px-4 py-3 rounded-2xl relative ${
                  mine ? "bg-blue-600" : "bg-[#1f2937]"
                }`}
              >
                {/* REPLY PREVIEW */}
                {msg.replyTo && (
                  <div className="bg-black/30 text-xs px-2 py-1 rounded mb-2">
                    ↪ {msg.replyTo.text}
                  </div>
                )}

                {/* CONTENT */}
                {msg.type === "text" && <p>{msg.text}</p>}
                {msg.type === "image" && (
                  <img
                    src={`http://localhost:4000${msg.imageUrl}`}
                    className="rounded-lg max-w-xs mt-1"
                  />
                )}

                {/* FOOTER */}
                <p className="text-[11px] mt-1 text-right opacity-60">
                  {formatTime(msg.createdAt)}
                  {mine &&
                    msg.status === "seen" &&
                    ` • Seen at ${formatTime(msg.seenAt)}`}
                </p>

                {/* ACTIONS */}
                {mine && (
                  <div className="hidden group-hover:flex absolute -top-3 -right-3 bg-black/70 p-1 rounded-full gap-1">
                    <FaReply
                      className="cursor-pointer"
                      onClick={() => setReplyTo(msg)}
                    />
                    <FaEdit
                      className="cursor-pointer"
                      onClick={() => {
                        setEditMsg(msg);
                        setNewMessage(msg.text);
                      }}
                    />
                    <FaTrash
                      className="cursor-pointer"
                      onClick={() => deleteMessage(msg._id)}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* REPLY BAR */}
      {replyTo && (
        <div className="bg-[#1e293b] p-2 flex justify-between items-center text-sm">
          <span>Replying to: {replyTo.text}</span>
          <FaTimes
            className="cursor-pointer"
            onClick={() => setReplyTo(null)}
          />
        </div>
      )}

      {/* EMOJI PICKER */}
      {showEmoji && (
        <div ref={emojiRef} className="absolute bottom-20 left-6 z-50">
          <Picker
            data={data}
            onEmojiSelect={(e) => setNewMessage((prev) => prev + e.native)}
          />
        </div>
      )}

      {/* INPUT BAR */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-3 px-4 py-3 bg-[#111827] border-t border-blue-900"
      >
        <FaSmile
          onClick={() => setShowEmoji(!showEmoji)}
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
    </div>
  );
}
