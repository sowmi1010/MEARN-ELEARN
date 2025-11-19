// src/components/student/UpcomingLive.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { FaVideo } from "react-icons/fa";

export default function UpcomingLive({ compact = false }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await api.get("/student/dashboard/live", { headers });
        const list = Array.isArray(res.data) ? res.data : [];
        setEvents(list);
      } catch (err) {
        console.warn("Live API failed, loading fallback data…");

        setEvents([
          {
            id: "1",
            title: "Units and Dimensions Part-1",
            time: "5:30 PM",
            teacher: "Physics Dept",
          },
          {
            id: "2",
            title: "Atoms & Molecules",
            time: "9:00 PM",
            teacher: "Chemistry Dept",
          },
        ]);
      }
    }

    load();
  }, []);

  /* =========================================================
        COMPACT VERSION  (right sidebar small view)
  ========================================================= */
  if (compact) {
    return (
      <div className="space-y-2 text-sm">
        {events.map((e, i) => (
          <div
            key={e.id || i}
            className="
              p-3 rounded-xl 
              bg-[#0d0d17] 
              border border-purple-800/20
              shadow-sm
              flex justify-between items-center
            "
          >
            <div>
              <div className="font-semibold text-gray-200">{e.title}</div>
              <div className="text-xs text-gray-400">{e.time}</div>
            </div>

            <button
              className="
                bg-purple-600 hover:bg-purple-700 
                px-3 py-1.5 
                text-xs 
                rounded-lg text-white 
                transition-all
              "
            >
              Join
            </button>
          </div>
        ))}
      </div>
    );
  }

  /* =========================================================
        FULL PREMIUM CARD VERSION
  ========================================================= */
  return (
    <div
      className="
        bg-[#0d0d17]
        p-5 rounded-2xl 
        border border-purple-900/20 
        shadow-lg 
        text-gray-200
      "
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <FaVideo className="text-purple-400 text-lg" />
        <h3 className="text-lg font-semibold text-purple-300">Upcoming Live</h3>
      </div>

      <div className="space-y-4">
        {events.map((e, i) => (
          <div
            key={e.id || i}
            className="
              p-4 rounded-xl
              bg-[#11111f]
              border border-purple-900/20
              shadow-sm
              flex justify-between items-center
              hover:border-purple-700/30
              transition-all
            "
          >
            {/* Left Section */}
            <div>
              <div className="font-semibold text-gray-100 text-[15px]">
                {e.title}
              </div>

              <div className="text-xs text-gray-400 mt-1">
                {e.time} • {e.teacher}
              </div>
            </div>

            {/* Join Button */}
            <button
              className="
                bg-purple-600 hover:bg-purple-700 
                px-4 py-2 
                rounded-xl 
                font-medium 
                text-sm 
                text-white 
                shadow 
                transition-all
              "
            >
              Join Live
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
