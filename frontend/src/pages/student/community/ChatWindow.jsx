// src/pages/student/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import api from "../../../utils/api";

export default function ChatWindow({ chat, socket, onClose, onChatUpdate }) {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesRef = useRef(null);
  const chatId = chat._id;

  // Load messages
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/chat/message/${chatId}`);
        setMessages(res.data || []);
        scrollToBottom();
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  // join chat room via socket when socket available
  useEffect(() => {
    if (!socket) return;

    // join the room
    socket.emit("joinChat", chatId);

    // Listen for messages in this chat
    const onReceive = (payload) => {
      if (payload.chatId === chatId) {
        setMessages((prev) => [...prev, payload]);
        // update parent chat list (lastMessage)
        if (onChatUpdate) {
          onChatUpdate({ ...chat, lastMessage: payload, updatedAt: payload.createdAt });
        }
        scrollToBottom();
      }
    };

    const onUserTyping = ({ chatId: cId, senderId }) => {
      if (cId !== chatId) return;
      if (String(senderId._id || senderId) === String(user._id || user.id)) return; // ignore self
      setTypingUsers((s) => new Set(s).add(String(senderId._id || senderId)));
    };

    const onUserStopped = ({ chatId: cId, senderId }) => {
      if (cId !== chatId) return;
      setTypingUsers((s) => {
        const copy = new Set(s);
        copy.delete(String(senderId._id || senderId));
        return copy;
      });
    };

    socket.on("receiveMessage", onReceive);
    socket.on("userTyping", onUserTyping);
    socket.on("userStoppedTyping", onUserStopped);

    return () => {
      socket.emit("leaveAllRooms"); // safe leave all rooms (server handler exists)
      socket.off("receiveMessage", onReceive);
      socket.off("userTyping", onUserTyping);
      socket.off("userStoppedTyping", onUserStopped);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, chatId, onChatUpdate]);

  // Scroll helper
  function scrollToBottom() {
    setTimeout(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }, 50);
  }

  // Typing debounce
  const typingTimeoutRef = useRef(null);
  function emitTyping() {
    if (!socket) return;
    socket.emit("typing", { chatId, senderId: user._id || user.id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { chatId, senderId: user._id || user.id });
    }, 800);
  }

  // Send message
  async function sendMessage(e) {
    e?.preventDefault();
    if (!text.trim()) return;

    // optimistic UI: build a temp message
    const temp = {
      _id: `temp-${Date.now()}`,
      chatId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      senderId: {
        _id: user._id || user.id,
        name: user.name || user.firstName || user.email,
      },
    };
    setMessages((m) => [...m, temp]);
    scrollToBottom();
    setText("");

    // emit socket (server saves + broadcasts)
    try {
      if (socket) {
        socket.emit("sendMessage", {
          chatId,
          senderId: user._id || user.id,
          senderModel: user.role ? capitalize(user.role) : "User",
          text: temp.text,
        });
      }

      // also POST to API as fallback to ensure message saved
      // your server .sendMessage endpoint returns saved message
      await api.post("/chat/message", {
        chatId,
        text: temp.text,
      });
      // reload last message: server socket will update list with real message
    } catch (err) {
      console.error("Send message failed:", err);
    }
  }

  function capitalize(s = "") {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between p-4 bg-[#081024] rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold">
            {chat.participants?.length === 2 ? chat.participants.find(p => String(p._id || p) !== String(user._id || user.id))?.name?.charAt(0) || "U" : "G"}
          </div>
          <div>
            <div className="font-semibold text-white">
              {chat.groupName || (chat.participants?.find(p => String(p._id || p) !== String(user._id || user.id))?.name) || "Chat"}
            </div>
            <div className="text-xs text-gray-400">{chat.participants?.length} participants</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            {typingUsers.size > 0 ? "Someone typing..." : ""}
          </div>
          <button onClick={onClose} className="px-3 py-1 bg-red-600 rounded text-white">Close</button>
        </div>
      </header>

      {/* messages */}
      <div ref={messagesRef} className="flex-1 overflow-auto p-4 space-y-3 bg-[#0b0f1a]">
        {messages.map((m) => {
          const sender = m.senderId && (m.senderId.name || m.senderId.firstName || m.senderId.email) || "You";
          const mine = String(m.senderId._id || m.senderId) === String(user._id || user.id);
          return (
            <div key={m._id} className={`max-w-xl ${mine ? "ml-auto text-right" : ""}`}>
              <div className={`inline-block p-3 rounded-lg ${mine ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-100"}`}>
                <div className="text-sm">{m.text}</div>
                <div className="text-xs text-gray-200 mt-1">{!mine ? sender : "You"} • {new Date(m.createdAt).toLocaleTimeString()}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* input */}
      <form onSubmit={sendMessage} className="p-4 bg-[#081024] rounded-b-lg flex items-center gap-3">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            emitTyping();
          }}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 rounded bg-[#0d1325] outline-none text-white"
        />
        <button type="submit" className="bg-green-600 px-4 py-2 rounded text-white">Send</button>
      </form>
    </div>
  );
}
