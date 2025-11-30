// src/pages/Live.jsx
import React, { useState } from "react";
import WebRTCRoom from "../../../components/LiveRoom/WebRTCRoom";
import ChatPanel from "../../../components/LiveRoom/ChatPanel";

export default function Live() {
  const [role] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u?.role === "teacher" ? "teacher" : "student";
    } catch {
      return "student";
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060A] via-[#070A12] to-[#0A0F1A] text-gray-100 relative overflow-hidden">

      {/* 🔥 Background Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-700/20 blur-[160px] rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/20 blur-[160px] rounded-full"></div>

      {/* HEADER */}
      <header className="relative z-10 flex items-center justify-between p-6">
        
        {/* LEFT SIDE — TITLE */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/10 border border-purple-700/30 backdrop-blur-xl flex items-center justify-center shadow-lg">
            <i className="text-purple-300 text-2xl fas fa-video"></i>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-purple-300 tracking-wide">
              Live Classroom
            </h1>
            <p className="text-sm text-gray-400">
              Real-time session • You are: 
              <span className="text-purple-400 ml-1 capitalize">{role}</span>
            </p>
          </div>
        </div>

        {/* ROLE BADGE */}
        <div className="bg-white/10 backdrop-blur-xl px-5 py-2 rounded-full border border-purple-700/40 shadow-md relative">
          <span className="text-purple-300 font-semibold">
            {role === "teacher" ? "Host (Teacher)" : "Student"}
          </span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-10">

        {/* LEFT SIDE — VIDEO SECTION */}
        <section className="
          lg:col-span-2 
          bg-white/5 
          backdrop-blur-xl 
          rounded-3xl 
          border border-purple-800/20 
          p-4 
          shadow-2xl
        ">
          <div className="text-lg font-semibold text-purple-300 mb-3">
            Live Video
          </div>

          <div className="rounded-xl overflow-hidden border border-purple-700/30 shadow-inner bg-black/40">
            <WebRTCRoom roomId="main-room" role={role} />
          </div>
        </section>

        {/* RIGHT SIDE — CHAT + FUTURE WHITEBOARD */}
        <aside className="space-y-6">

          {/* CHAT BOX */}
          <div className="
            bg-white/5 
            backdrop-blur-xl 
            rounded-3xl 
            border border-purple-800/20 
            p-4 
            shadow-xl
            h-[70vh]
            overflow-hidden
          ">
            <div className="text-lg font-semibold text-purple-300 mb-3">
              Live Chat
            </div>

            <div className=" h-[calc(100%-2rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-transparent">
              <ChatPanel roomId="main-room" role={role} />
            </div>
          </div>

          {/* WHITEBOARD PLACEHOLDER (UPGRADE LATER) */}
          <div className="
            hidden 
            bg-white/5 
            backdrop-blur-xl 
            rounded-3xl 
            border border-purple-800/20 
            p-4 
            shadow-xl
          ">
            <div className="text-lg font-semibold text-purple-300 mb-2">
              Whiteboard (Coming Soon)
            </div>
            <div className="h-40 bg-black/20 rounded-xl border border-purple-700/20 flex items-center justify-center text-gray-400">
              Whiteboard module can be added here.
            </div>
          </div>

        </aside>
      </main>
    </div>
  );
}
