import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../utils/api";
import { FaBroadcastTower, FaClock, FaCalendarAlt } from "react-icons/fa";

export default function ViewLive() {
  const { id } = useParams();
  const [live, setLive] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE = "http://localhost:4000";

  // Fix thumbnail path
  const cleanPath = (path) => {
    if (!path) return "";
    const fixed = path.replace(/\\/g, "/").replace(/^.*uploads\//, "uploads/");
    return fixed.startsWith("http") ? fixed : `${BASE}/${fixed}`;
  };

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await api.get(`/live/${id}`);
        setLive(res.data);
      } catch (err) {
        console.error("Failed to fetch live:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLive();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#020617] text-red-400 text-xl">
        Loading Live Class...
      </div>
    );

  if (!live)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#020617] text-red-500 text-xl">
        Live class not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a1124] to-[#1e293b] text-white px-6 py-10">

      {/* MAIN CARD */}
      <div
        className="
          max-w-7xl mx-auto
          bg-white/5 backdrop-blur-xl
          border border-white/10
          rounded-3xl shadow-2xl shadow-red-900/30
          grid md:grid-cols-3 gap-10
          p-10
        "
      >
        {/* LEFT — LIVE DETAILS */}
        <div className="md:col-span-2 space-y-8">

          {/* TITLE */}
          <h1 className="text-4xl font-bold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">
            <FaBroadcastTower className="text-red-400 drop-shadow" />
            {live.title}
          </h1>

          {/* DESCRIPTION */}
          {live.description && (
            <div className="bg-black/40 p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-bold text-red-400 mb-2">
                Description
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {live.description}
              </p>
            </div>
          )}

          {/* DATE & TIME */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3 bg-black/40 px-5 py-3 rounded-xl border border-white/10">
              <FaCalendarAlt className="text-red-400" />
              <span>{new Date(live.date).toDateString()}</span>
            </div>

            <div className="flex items-center gap-3 bg-black/40 px-5 py-3 rounded-xl border border-white/10">
              <FaClock className="text-red-400" />
              <span>{live.time}</span>
            </div>
          </div>
        </div>

        {/* RIGHT — INFO PANEL */}
        <div className="bg-black/40 p-6 rounded-2xl border border-white/10 shadow-xl space-y-6">

          {/* THUMBNAIL */}
          {live.thumbnail && (
            <img
              src={cleanPath(live.thumbnail)}
              alt="Live Thumbnail"
              className="w-full h-48 object-cover rounded-xl border border-red-400/20 shadow-lg"
            />
          )}

          <Info label="Group" value={live.group} />
          <Info label="Standard" value={live.standard} />
          <Info label="Board" value={live.board} />
          <Info label="Language" value={live.language} />
          <Info label="Subject" value={live.subject} />
          <Info label="Category" value={live.category} />

          {/* STATUS */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Status
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                live.status === "live"
                  ? "bg-red-600/20 text-red-400"
                  : live.status === "completed"
                  ? "bg-green-600/20 text-green-400"
                  : "bg-yellow-600/20 text-yellow-400"
              }`}
            >
              {live.status?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable Info Component */
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="text-[15px] font-semibold text-red-300">{value || "-"}</p>
  </div>
);
