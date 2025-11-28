import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import useGlobalSearch from "../../../hooks/useGlobalSearch";
import api from "../../../utils/api";

let socket;

export default function ChatList() {
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState("chats"); // chats | users

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const role = currentUser?.role;
  const basePath = role === "student" ? "/student/team" : "/admin/team";

  const rawSearch = useGlobalSearch();
  const search = typeof rawSearch === "string" ? rawSearch.toLowerCase() : "";

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!currentUser?._id) return;

    if (!socket) {
      socket = io("http://localhost:4000", { transports: ["websocket"] });
      socket.emit("joinUser", currentUser._id);
    }

    socket.on("receiveMessage", (msg) => {
      setItems((prev) =>
        prev.map((chat) =>
          chat._id === msg.chatId
            ? {
                ...chat,
                lastMessage: msg,
                unread: (chat.unread || 0) + 1,
              }
            : chat
        )
      );
    });

    return () => socket?.off("receiveMessage");
  }, [currentUser?._id]);

  /* ================= LOAD CHATS ONLY ================= */
  useEffect(() => {
    const loadChats = async () => {
      try {
        const { data } = await api.get("/chat/list");

        if (!data || data.length === 0) {
          setItems([]);
          setMode("chats");
          return;
        }

        const mapped = data
          .map((chat) => {
            const other = chat.participants?.find(
              (u) => u?._id !== currentUser._id
            );

            if (!other) return null;

            return {
              _id: chat._id,
              user: other,
              lastMessage: chat.lastMessage || null,
              unread: 0,
              isNew: false,
              online: false,
            };
          })
          .filter(Boolean);

        setItems(mapped);
        setMode("chats");
      } catch (err) {
        console.error("Load chats error:", err);
      }
    };

    loadChats();
  }, [currentUser?._id]);

  /* ================= LOAD ALL USERS FOR NEW CHAT ================= */
  const loadAllUsers = async () => {
    try {
      const [admins, students, mentors, users] = await Promise.all([
        api.get("/admin/public-list"),
        api.get("/student/public-list"),
        api.get("/mentor/detailed-mentors"),
        api.get("/user/public-list"),
      ]);

      const combined = [
        ...admins.data,
        ...students.data,
        ...mentors.data,
        ...users.data,
      ];

      const final = combined
        .filter((u) => u._id !== currentUser._id)
        .map((u) => ({
          _id: u._id,
          user: {
            _id: u._id,
            firstName: u.firstName || u.name || "User",
            lastName: u.lastName || "",
            photo: u.photo || "",
            role: u.role || "",
          },
          lastMessage: null,
          unread: 0,
          isNew: true,
          online: false,
        }));

      setItems(final);
      setMode("users");
    } catch (err) {
      console.error("loadAllUsers error:", err.message);
    }
  };

  /* ================= OPEN CHAT ================= */
  const openChat = async (targetUserId) => {
    try {
      await api.post("/chat/access", { userId: targetUserId });
      navigate(`${basePath}/${targetUserId}`);
    } catch (err) {
      console.error("Open chat error:", err);
    }
  };

  /* ================= FILTER ================= */
  const filtered = items.filter((i) => {
    const name = `${i?.user?.firstName || ""} ${
      i?.user?.lastName || ""
    }`.toLowerCase();

    return name.includes(search);
  });

  /* ================= FORMAT TIME ================= */
  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0f19] text-white rounded-xl overflow-hidden">
      {/* HEADER */}
      <div className="p-4 border-b border-blue-900 flex justify-between items-center">
        <h2 className="text-lg font-bold text-blue-400">
          {mode === "chats" ? "Chats" : "New Chat"}
        </h2>

        <button
          onClick={() => (mode === "chats" ? loadAllUsers() : setMode("chats"))}
          className="bg-green-600 px-3 py-1 rounded-md text-sm hover:bg-green-700"
        >
          {mode === "chats" ? "New Chat" : "Back"}
        </button>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-center mt-10 text-gray-500">
            No users found
          </p>
        )}

        {filtered.map((item) => {
          const u = item.user;
          const last = item.lastMessage;

          return (
            <div
              key={item._id}
              onClick={() => openChat(u._id)}
              className="flex items-center justify-between px-4 py-3 border-b border-gray-700 hover:bg-[#1e293b] cursor-pointer transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    u?.photo
                      ? `http://localhost:4000${u.photo}`
                      : "/default-avatar.png"
                  }
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold">
                    {u.firstName} {u.lastName}
                  </p>

                  <p className="text-xs text-gray-400 truncate w-48">
                    {item.isNew
                      ? "Start new chat"
                      : !last
                      ? "No messages yet"
                      : last.type === "image"
                      ? "📷 Photo"
                      : last.text}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] text-gray-400">
                  {formatTime(last?.createdAt)}
                </span>
                {item.unread > 0 && (
                  <span className="bg-green-500 text-black text-xs px-2 py-0.5 rounded-full font-semibold">
                    {item.unread}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
