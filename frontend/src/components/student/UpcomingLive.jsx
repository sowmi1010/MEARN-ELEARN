// src/components/student/UpcomingLive.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function UpcomingLive({ compact = false }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Correct backend route
        const res = await api.get("/student/dashboard/live", { headers });

        const list = Array.isArray(res.data) ? res.data : [];

        setEvents(list);
      } catch (err) {
        console.warn("Live API failed, loading fallback data…");

        // Fallback live sessions (your example)
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

  /* ---------------------------------------------------------
     COMPACT VERSION (right sidebar / small card)
  --------------------------------------------------------- */
  if (compact) {
    return (
      <div className="space-y-2 text-sm">
        {events.map((e, index) => (
          <div
            key={e.id || index}
            className="p-2 bg-[#061121] rounded flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{e.title}</div>
              <div className="text-xs text-gray-400">{e.time}</div>
            </div>
            <button className="bg-purple-600 px-3 py-1 rounded">Join</button>
          </div>
        ))}
      </div>
    );
  }

  /* ---------------------------------------------------------
     FULL CARD VERSION
  --------------------------------------------------------- */
  return (
    <div className="bg-[#081024] p-4 rounded-xl shadow-lg text-gray-200">
      <h3 className="font-semibold mb-3">Upcoming Live</h3>

      <div className="space-y-3">
        {events.map((e, index) => (
          <div
            key={e.id || index}
            className="p-3 bg-[#061121] rounded flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{e.title}</div>
              <div className="text-xs text-gray-400">
                {e.time} • {e.teacher}
              </div>
            </div>
            <button className="bg-purple-600 px-4 py-2 rounded">Join</button>
          </div>
        ))}
      </div>
    </div>
  );
}
