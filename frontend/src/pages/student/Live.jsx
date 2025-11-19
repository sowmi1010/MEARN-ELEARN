// src/pages/Live.jsx
import React, { useState } from "react";
import WebRTCRoom from "../../components/LiveRoom/WebRTCRoom";
import ChatPanel from "../../components/LiveRoom/ChatPanel";

export default function Live() {
  // mode: 'teacher' or 'student' - choose based on your auth logic
  const [role] = useState(() => {
    // sample: read from localStorage user.role or default "student"
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u?.role === "teacher" ? "teacher" : "student";
    } catch {
      return "student";
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060a] to-[#07121a] text-gray-100 p-6">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src="/mnt/data/Screenshot 2025-11-19 105620.png"
            alt="class"
            className="w-14 h-14 rounded-lg object-cover shadow-lg"
          />
          <div>
            <h1 className="text-2xl font-bold text-purple-300">Live Class</h1>
            <p className="text-sm text-gray-400">Teacher: Live session — role: {role}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0f172a] px-3 py-2 rounded-full border border-purple-800/30 text-sm">
            {role === "teacher" ? "Host (Teacher)" : "Student"}
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Video + controls (take 2/3 on large screens) */}
        <section className="lg:col-span-2 bg-[#081024] rounded-2xl p-4 shadow-lg">
          <WebRTCRoom roomId="main-room" role={role} />
        </section>

        {/* Right: Whiteboard (toggle) + Chat */}
        <aside className="space-y-6">
          <div className="bg-[#081024] rounded-2xl p-4 shadow-lg">
            <ChatPanel roomId="main-room" role={role} />
          </div>
        </aside>
      </main>
    </div>
  );
}
