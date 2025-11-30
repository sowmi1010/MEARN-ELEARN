// src/components/LiveRoom/ChatPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import socket from "../../utils/socket";

export default function ChatPanel({ roomId = "main-room", role = "student" }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [raiseHand, setRaiseHand] = useState(false);

  const listRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "You";

  /* 🔌 JOIN ROOM */
  useEffect(() => {
    socket.on("chat-message", (m) => setMessages((prev) => [...prev, m]));
    socket.emit("chat-join", { roomId });

    return () => {
      socket.off("chat-message");
      socket.emit("chat-leave", { roomId });
    };
  }, [roomId]);

  /* 📤 SEND MESSAGE */
  const send = () => {
    if (!text.trim()) return;

    const msg = {
      user: userName,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      role,
    };

    socket.emit("chat-message", { roomId, message: msg });
    setText("");
  };

  /* 🔽 AUTO SCROLL */
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /* ✋ RAISE HAND */
  const toggleHand = () => {
    const next = !raiseHand;
    setRaiseHand(next);

    socket.emit("raise-hand", {
      roomId,
      raised: next,
      user: userName,
    });
  };

  /* 📎 FILE UPLOAD */
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    alert("File upload is not implemented. Add server upload to enable.");
    e.target.value = "";
  };

  return (
    <div className="flex flex-col h-full">

      {/* 📝 CHAT MESSAGE LIST */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-2 py-3 space-y-3 rounded-xl 
        scrollbar-thin scrollbar-thumb-purple-700/60 scrollbar-track-transparent"
      >
        {messages.map((m, idx) => {
          const isSelf = m.user === userName;

          return (
            <div
              key={idx}
              className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[80%] px-4 py-3 rounded-2xl shadow-md bg-gradient-to-br
                  ${
                    isSelf
                      ? "from-purple-600/70 to-purple-700/80 text-white rounded-tr-none"
                      : "from-[#0f1629]/80 to-[#1a2338]/70 text-gray-200 border border-purple-800/20 rounded-tl-none"
                  }
                `}
              >
                {/* NAME + TIME */}
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-sm text-purple-200">
                    {m.user}
                  </span>
                  <span className="text-xs text-gray-400">{m.time}</span>
                </div>

                {/* TEXT */}
                <div className="text-sm leading-relaxed">{m.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✍️ INPUT BAR */}
      <div className="mt-4 flex items-center gap-2">
        {/* FILE UPLOAD */}
        <input type="file" id="chat-file" className="hidden" onChange={onFile} />
        <label
          htmlFor="chat-file"
          className="cursor-pointer w-10 h-10 flex items-center justify-center 
          bg-white/10 border border-purple-700/40 rounded-xl hover:bg-white/20 transition"
        >
          📎
        </label>

        {/* TEXT INPUT */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-xl bg-black/20 border border-purple-800/30 
          text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/50 transition"
        />

        {/* SEND BUTTON */}
        <button
          onClick={send}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg 
          text-sm font-semibold transition"
        >
          Send
        </button>
      </div>

      {/* ✋ RAISE HAND + REACTIONS */}
      <div className="mt-4 flex items-center gap-3">

        {/* Raise Hand */}
        <button
          onClick={toggleHand}
          className={`
            px-4 py-2 rounded-xl font-semibold text-sm transition shadow-lg
            ${
              raiseHand
                ? "bg-yellow-400 text-black"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }
          `}
        >
          {raiseHand ? "✋ Raised" : "Raise Hand"}
        </button>

        {/* Quick Reactions */}
        <div className="flex gap-2 ml-auto">
          <Reaction onSend={() => setText("❤️")} icon="❤️" />
          <Reaction onSend={() => setText("👍")} icon="👍" />
          <Reaction onSend={() => setText("🎉")} icon="🎉" />
        </div>
      </div>
    </div>
  );
}

/* ❤️ Small Reaction Component */
function Reaction({ icon, onSend }) {
  return (
    <button
      onClick={onSend}
      className="w-9 h-9 flex items-center justify-center rounded-xl text-lg 
      bg-white/10 hover:bg-white/20 transition shadow-md"
    >
      {icon}
    </button>
  );
}
