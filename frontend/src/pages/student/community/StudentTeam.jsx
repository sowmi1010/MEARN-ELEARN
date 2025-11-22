// src/pages/student/StudentTeam.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../../../utils/api";
import { io } from "socket.io-client";
import ChatWindow from "./ChatWindow";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export default function StudentTeam() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })();

  // Connect socket once
  useEffect(() => {
    if (!user) return;

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      // tell server who we are (single active socket per user)
      socketRef.current.emit("joinUser", user._id || user.id || user._id);
    });

    socketRef.current.on("onlineUsers", (list) => {
      setOnlineUsers(Array.isArray(list) ? list : []);
    });

    // receive message at top-level (useful to refresh chat list)
    socketRef.current.on("receiveMessage", (payload) => {
      // update lastMessage in chats list if present
      setChats((prev) =>
        prev.map((c) =>
          c._id === payload.chatId ? { ...c, lastMessage: payload, updatedAt: payload.createdAt } : c
        )
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?._id]);

  // load chats
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/chat");
        setChats(res.data || []);
      } catch (err) {
        console.error("Failed to load chats:", err);
      }
    }
    load();
  }, []);

  // open/create chat with user (for admin/student/mentor)
  async function openChatWith(userId) {
    try {
      const res = await api.post("/chat/access", { userId });
      const chat = res.data;
      // ensure chat in list
      setChats((prev) => {
        const exists = prev.find((c) => String(c._id) === String(chat._id));
        if (exists) return prev.map((p) => (String(p._id) === String(chat._id) ? chat : p));
        return [chat, ...prev];
      });
      setActiveChat(chat);
    } catch (err) {
      console.error("openChatWith error:", err);
    }
  }

  // pick chat from list
  function openChat(chat) {
    setActiveChat(chat);
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-80 bg-[#081024] p-4 overflow-auto border-r border-gray-800">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-purple-300">Team / Chats</h2>
          <p className="text-sm text-gray-400 mt-1">Online: {onlineUsers.length}</p>
        </div>

        <div className="space-y-3">
          {chats.map((chat) => {
            const other = (chat.participants || []).find(
              (p) => String(p._id || p) !== String(user._id || user.id)
            );
            const name = other?.name || other?.firstName || other?.email || "User";
            const lastText = chat.lastMessage?.text || "";
            const isOnline = onlineUsers.includes(String(other?._id || other));
            return (
              <div
                key={chat._id}
                onClick={() => openChat(chat)}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  activeChat?._id === chat._id ? "bg-purple-700/30" : "hover:bg-purple-700/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{name}</div>
                    <div className="text-xs text-gray-400 truncate">{lastText}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">{new Date(chat.updatedAt).toLocaleString()}</div>
                    <div
                      className={`w-3 h-3 rounded-full mt-2 ${isOnline ? "bg-green-400" : "bg-gray-600"}`}
                      title={isOnline ? "Online" : "Offline"}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <button
            onClick={() => {
              // example: open chat with support/admin -> prompt for id or open create dialog
              // For simplicity: prompt for id
              const uid = prompt("Enter user id to chat with (admin/student/mentor id):");
              if (uid) openChatWith(uid);
            }}
            className="w-full bg-purple-600 py-2 rounded text-white"
          >
            New Chat
          </button>
        </div>
      </aside>

      {/* Main: Chat window */}
      <main className="flex-1 bg-[#0b0f1a] p-6 overflow-auto">
        {activeChat ? (
          <ChatWindow
            key={activeChat._id}
            chat={activeChat}
            socket={socketRef.current}
            onClose={() => setActiveChat(null)}
            onChatUpdate={(updated) =>
              setChats((prev) => prev.map((c) => (c._id === updated._id ? updated : c)))
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Select a chat to start messaging.
          </div>
        )}
      </main>
    </div>
  );
}
