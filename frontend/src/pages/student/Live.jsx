import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000");
export default function Live() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;

    const message = {
      user: "You",
      text,
      time: new Date().toLocaleTimeString(),
    };
    socket.emit("sendMessage", message);
    setText("");
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Live Chat</h1>

      {/* Chat Box */}
      <div className="bg-[#0f172a] p-4 rounded-lg h-[70vh] overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="p-2 mb-2 bg-[#1e293b] rounded">
            <p className="font-bold">{msg.user}</p>
            <p>{msg.text}</p>
            <span className="text-xs text-gray-400">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 p-3 rounded bg-[#1e293b]"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
