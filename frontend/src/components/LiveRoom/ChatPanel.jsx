// src/components/LiveRoom/ChatPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import socket from "../../utils/socket";

export default function ChatPanel({ roomId = "main-room", role = "student" }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [raiseHand, setRaiseHand] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    socket.on("chat-message", (m) => setMessages((prev) => [...prev, m]));
    socket.emit("chat-join", { roomId });
    return () => {
      socket.off("chat-message");
      socket.emit("chat-leave", { roomId });
    };
  }, [roomId]);

  const send = () => {
    if (!text.trim()) return;
    const msg = {
      user: JSON.parse(localStorage.getItem("user") || "{}").name || "You",
      text: text.trim(),
      time: new Date().toLocaleTimeString(),
    };
    socket.emit("chat-message", { roomId, message: msg });
    setText("");
  };

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const toggleHand = () => {
    setRaiseHand((v) => {
      const next = !v;
      socket.emit("raise-hand", {
        roomId,
        raised: next,
        user: JSON.parse(localStorage.getItem("user") || "{}").name || "You",
      });
      return next;
    });
  };

  // file send stub - you must implement server file upload endpoint to handle files
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // TODO: upload file to server, then emit chat message with file url
    alert(
      "File sending not implemented in demo. Implement server upload and then emit event with file URL."
    );
    e.target.value = "";
  };

  return (
    <div>
      <div
        ref={listRef}
        className="h-56 overflow-y-auto p-2 space-y-2 border-b border-purple-800/20 mb-3"
      >
        {messages.map((m, i) => (
          <div key={i} className="p-2 rounded bg-[#0c1220]">
            <div className="flex justify-between">
              <div className="font-semibold text-sm">{m.user}</div>
              <div className="text-xs text-gray-400">{m.time}</div>
            </div>
            <div className="text-sm mt-1">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="file"
          onChange={onFile}
          className="hidden"
          id="chat-file"
        />
        <label
          htmlFor="chat-file"
          className="px-3 py-2 bg-gray-800 rounded cursor-pointer text-sm"
        >
          Attach
        </label>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 px-3 py-2 bg-[#0f172a] rounded"
        />
        <button onClick={send} className="px-3 py-2 bg-purple-600 rounded">
          Send
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          className={`px-3 py-1 rounded ${
            raiseHand ? "bg-yellow-500" : "bg-gray-800"
          }`}
          onClick={toggleHand}
        >
          {raiseHand ? "Hand Raised" : "Raise Hand"}
        </button>

        <div className="ml-auto text-xs text-gray-400">
          Reactions: ❤️ 👍 🎉 (click in chat to send)
        </div>
      </div>
    </div>
  );
}
