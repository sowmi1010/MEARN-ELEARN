import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import useGlobalSearch from "../../../hooks/useGlobalSearch";
import api from "../../../utils/api";

let socket;

export default function ChatList() {
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState("chats");

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const role = currentUser?.role;
  const basePath = role === "student" ? "/student/team" : "/admin/team";

  const rawSearch = useGlobalSearch();
  const search = typeof rawSearch === "string" ? rawSearch.toLowerCase() : "";

  /* ============ SOCKET ============ */
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
            ? { ...chat, lastMessage: msg, unread: (chat.unread || 0) + 1 }
            : chat
        )
      );
    });

    return () => socket?.off("receiveMessage");
  }, [currentUser?._id]);

  /* ============ LOAD CHATS ============ */
  useEffect(() => {
    const loadChats = async () => {
      try {
        const { data } = await api.get("/chat/list");

        if (!data) return setItems([]);

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
      } catch (err) {
        console.error("Load chats error:", err);
      }
    };

    loadChats();
  }, [currentUser?._id]);

  /* ============ LOAD ALL USERS ============ */
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
            photo: u.photo,
            role: u.role,
          },
          lastMessage: null,
          unread: 0,
          isNew: true,
        }));

      setItems(final);
      setMode("users");
    } catch (err) {
      console.error(err);
    }
  };

  const openChat = async (targetUserId) => {
    try {
      await api.post("/chat/access", { userId: targetUserId });
      navigate(`${basePath}/${targetUserId}`);
    } catch (err) {
      console.error(err);
    }
  };

  /* ============ FILTER ============ */
  const filtered = items.filter((i) => {
    const name = `${i?.user?.firstName || ""} ${i?.user?.lastName || ""}`.toLowerCase();
    return name.includes(search);
  });

  const formatTime = (date) =>
    date
      ? new Date(date).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  /* ==========================================================
     ULTRA MODERN UI STARTS HERE
     ========================================================== */

  return (
    <div className="
        h-full flex flex-col 
        bg-gradient-to-br from-[#0a0f1e] to-[#0f172a] 
        backdrop-blur-xl 
        text-white  
        border border-white/10 shadow-xl overflow-hidden
      "
    >
      {/* HEADER */}
      <div className="
          p-5 border-b border-white/10 
          bg-white/5 backdrop-blur-md 
          flex justify-between items-center
        "
      >
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          {mode === "chats" ? "Messages" : "Start New Chat"}
        </h2>

        <button
          onClick={() => (mode === "chats" ? loadAllUsers() : setMode("chats"))}
          className="
            px-4 py-1.5 rounded-lg text-sm font-semibold
            bg-gradient-to-r from-green-500 to-emerald-600
            hover:opacity-90 transition shadow-lg shadow-green-600/30
          "
        >
          {mode === "chats" ? "+ New" : "← Back"}
        </button>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto custom-scroll p-2">
        {filtered.length === 0 && (
          <div className="text-center mt-16 text-gray-500">
            No conversations found
          </div>
        )}

        {filtered.map((item) => {
          const u = item.user;
          const last = item.lastMessage;

          return (
            <div
              key={item._id}
              onClick={() => openChat(u._id)}
              className="
                group flex items-center justify-between p-4 mb-2
                bg-white/5 hover:bg-white/10 
                rounded-xl cursor-pointer transition-all
                border border-white/5 hover:border-blue-500/20
                shadow shadow-black/20 hover:shadow-blue-600/20
              "
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="
                    w-12 h-12 rounded-full bg-gradient-to-br 
                    from-blue-600 to-cyan-500 p-[2px]
                    shadow-lg shadow-blue-500/30
                  "
                >
                  <img
                    src={
                      u?.photo
                        ? `http://localhost:4000${u.photo}`
                        : "/default-avatar.png"
                    }
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                {/* Name & Last Message */}
                <div>
                  <p className="font-semibold text-[15px] tracking-wide">
                    {u.firstName} {u.lastName}
                  </p>

                  <p className="text-xs text-gray-400 truncate w-52 mt-0.5">
                    {item.isNew
                      ? "Start conversation"
                      : !last
                      ? "No messages yet"
                      : last.type === "image"
                      ? "📷 Photo"
                      : last.text}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] text-gray-500">
                  {formatTime(last?.createdAt)}
                </span>

                {item.unread > 0 && (
                  <span className="
                      bg-green-400 text-black text-xs px-2 py-0.5 
                      rounded-full font-bold shadow-lg
                    "
                  >
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
