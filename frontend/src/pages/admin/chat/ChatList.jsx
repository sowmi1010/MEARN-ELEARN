import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../../utils/api";
import useGlobalSearch from "../../../hooks/useGlobalSearch";

let socket;

export default function ChatList() {
  const [items, setItems] = useState([]); // chats OR users
  const [mode, setMode] = useState("chats"); // chats | users
  const navigate = useNavigate();

  const rawSearch = useGlobalSearch();
  const safeSearch =
    typeof rawSearch === "string" ? rawSearch.toLowerCase() : "";

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!currentUser?._id) return;

    if (!socket) {
      socket = io("http://localhost:4000", { transports: ["websocket"] });
      socket.emit("joinUser", currentUser._id);
    }

    socket.on("receiveMessage", (message) => {
      setItems((prev) =>
        prev.map((chat) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              lastMessage: message,
              unread: (chat.unread || 0) + 1,
            };
          }
          return chat;
        })
      );
    });

    return () => socket?.off("receiveMessage");
  }, [currentUser?._id]);

  /* ============ LOAD CHAT LIST FIRST ============ */
  useEffect(() => {
    const loadChats = async () => {
      try {
        const { data } = await api.get("/chat/list");

        if (data.length === 0) {
          // If no chats => load all users
          loadAllUsers();
          return;
        }

        const finalChats = data.map((chat) => {
          const otherUser = chat.participants.find(
            (p) => p._id !== currentUser._id
          );

          return {
            _id: chat._id,
            user: otherUser,
            lastMessage: chat.lastMessage || null,
            unread: 0,
          };
        });

        setItems(finalChats);
        setMode("chats");
      } catch (err) {
        console.error(err);
      }
    };

    if (currentUser?._id) loadChats();
  }, [currentUser?._id]);

  /* ============ LOAD ALL USERS IF NO CHAT ============ */
  const loadAllUsers = async () => {
    try {
      const [admins, students, mentors, users] = await Promise.all([
        api.get("/admin/detailed-admins"),
        api.get("/student/detailed-students"),
        api.get("/mentor"),
        api.get("/auth/users"),
      ]);

      const convert = (data, fallbackRole) =>
        data.map((u) => ({
          _id: u._id,
          user: {
            _id: u._id,
            firstName: u.firstName || u.name,
            lastName: u.lastName || "",
            photo: u.photo || u.profilePic || "",
          },
          lastMessage: null,
          unread: 0,
          isNew: true,
          role: fallbackRole,
        }));

      const finalUsers = [
        ...convert(admins.data, "admin"),
        ...convert(students.data, "student"),
        ...convert(mentors.data, "mentor"),
        ...(users.data.users || []).map((u) => ({
          _id: u._id,
          user: {
            _id: u._id,
            firstName: u.name,
            lastName: "",
            photo: u.profilePic || "",
          },
          lastMessage: null,
          unread: 0,
          isNew: true,
          role: "user",
        })),
      ];

      setItems(finalUsers.filter((u) => u.user._id !== currentUser._id));
      setMode("users");
    } catch (err) {
      console.error(err);
    }
  };

  /* ========== OPEN CHAT (Create if not exists) ========= */
  const openChat = async (targetUserId) => {
    try {
      const { data } = await api.post("/chat/access", {
        userId: targetUserId,
      });

      navigate(`/admin/team/${targetUserId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter((item) =>
    `${item.user?.firstName || ""} ${item.user?.lastName || ""}`
      .toLowerCase()
      .includes(safeSearch)
  );

  return (
    <div className="h-full bg-[#0b0f19] text-white">
      {/* HEADER */}
      <div className="p-4 border-b border-blue-900 flex justify-between items-center">
        <h2 className="text-lg font-bold text-blue-400">
          {mode === "chats" ? "Chats" : "New Chat"}
        </h2>

        <button
          onClick={() =>
            mode === "chats" ? loadAllUsers() : window.location.reload()
          }
          className="bg-green-600 px-4 py-1 rounded text-sm"
        >
          {mode === "chats" ? "New Chat" : "Chats"}
        </button>
      </div>

      {/* LIST */}
      <div className="overflow-y-auto h-[calc(100vh-90px)]">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const u = item.user;
            const last = item.lastMessage;

            return (
              <div
                key={item._id}
                onClick={() => openChat(u._id)}
                className="flex gap-4 p-4 border-b border-gray-700 hover:bg-[#1e293b] cursor-pointer"
              >
                <img
                  src={
                    u?.photo
                      ? `http://localhost:4000${u.photo}`
                      : "/default-avatar.png"
                  }
                  className="w-12 h-12 rounded-full object-cover border border-blue-500"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">
                    {u.firstName} {u.lastName}
                  </h3>

                  <p className="text-xs text-gray-400 truncate w-60">
                    {item.isNew
                      ? "Start new chat"
                      : last?.type === "image"
                      ? "📷 Image"
                      : last?.text || "No messages"}
                  </p>
                </div>

                {item.unread > 0 && (
                  <span className="bg-green-500 text-black text-xs px-2 py-1 rounded-full">
                    {item.unread}
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center mt-10 text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
}
