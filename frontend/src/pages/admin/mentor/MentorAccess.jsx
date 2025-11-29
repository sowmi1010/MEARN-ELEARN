import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";

import {
  HiOutlineChartBar,
  HiOutlineBookOpen,
  HiOutlineUserGroup,
  HiOutlineCurrencyRupee,
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineUsers,
  HiArrowLeft,
  HiShieldCheck,
  HiCheckBadge,
} from "react-icons/hi2";

/* 🚀 PREMIUM PERMISSION LIST */
const availablePermissions = [
  { key: "dashboard", label: "Dashboard", icon: <HiOutlineChartBar /> },
  { key: "home", label: "Home Page", icon: <HiOutlineHome /> },
  { key: "courses", label: "Courses", icon: <HiOutlineBookOpen /> },
  { key: "admin", label: "Admin", icon: <HiOutlineUser /> },
  { key: "mentor", label: "Mentor", icon: <HiOutlineUserGroup /> },
  { key: "students", label: "Students", icon: <HiOutlineUsers /> },
  { key: "payments", label: "Payments", icon: <HiOutlineCurrencyRupee /> },
];

export default function MentorAccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);
  const [mentorName, setMentorName] = useState("Mentor");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMentor();
  }, [id]);

  async function fetchMentor() {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/mentor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelected(res.data.permissions || []);
      setMentorName(res.data.firstName || "Mentor");
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  const togglePermission = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const selectAll = () =>
    setSelected(availablePermissions.map((p) => p.key));
  const clearAll = () => setSelected([]);

  async function handleSubmit() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/mentor/${id}/permissions`,
        { permissions: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Permissions updated successfully!");
      navigate("/admin/mentors");
    } catch (err) {
      alert("Updated failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white px-6 py-10">

      <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden 
        bg-[#0a0f1f]/90 border border-white/10 
        shadow-[0_0_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl">

        {/* 🔥 HEADER - ULTRA PREMIUM */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 
          px-8 py-6 flex justify-between items-center shadow-xl">

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl 
              bg-white/20 backdrop-blur-xl shadow-inner shadow-white/10">
              <HiShieldCheck className="text-3xl" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight drop-shadow-md">
                Access Control
              </h1>
              <p className="text-white/70 text-sm tracking-wide">
                Grant permissions to: <span className="font-semibold">{mentorName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white text-sm font-semibold">
            <HiCheckBadge className="text-xl" />
            Step 2 / 2
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-10 space-y-10">

          {/* TOP CONTROLS */}
          <div className="flex justify-between items-center">
            <p className="text-gray-300 text-sm">
              Select which modules this mentor can access.
            </p>

            <div className="flex gap-3">
              <button
                onClick={selectAll}
                className="px-5 py-2 rounded-xl text-sm font-semibold
                  bg-blue-600/20 border border-blue-500 text-blue-300
                  hover:bg-blue-600/40 transition shadow-lg shadow-blue-500/20">
                Select All
              </button>

              <button
                onClick={clearAll}
                className="px-5 py-2 rounded-xl text-sm font-semibold
                  bg-red-600/20 border border-red-500 text-red-300
                  hover:bg-red-600/40 transition shadow-lg shadow-red-500/20">
                Clear All
              </button>
            </div>
          </div>

          {/* GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

            {availablePermissions.map((p) => {
              const active = selected.includes(p.key);

              return (
                <div
                  key={p.key}
                  onClick={() => togglePermission(p.key)}
                  className={`
                    group cursor-pointer p-7 rounded-3xl backdrop-blur-xl
                    transition-all duration-300 border shadow-lg
                    hover:scale-[1.04]
                    ${
                      active
                        ? "bg-gradient-to-br from-blue-600 to-cyan-500 border-blue-400 shadow-blue-500/30"
                        : "bg-[#0f172a]/40 border-white/10 hover:border-blue-400/40"
                    }
                  `}
                >
                  {/* ICON */}
                  <div
                    className={`
                      text-4xl mb-4 transition
                      ${
                        active
                          ? "text-white drop-shadow-md"
                          : "text-blue-300 group-hover:text-blue-400"
                      }
                    `}
                  >
                    {p.icon}
                  </div>

                  {/* LABEL */}
                  <h3
                    className={`text-lg font-bold tracking-wide ${
                      active ? "text-white" : "text-gray-200"
                    }`}
                  >
                    {p.label}
                  </h3>

                  {/* ACTIVE BADGE */}
                  {active && (
                    <span className="mt-3 inline-block px-4 py-1 text-xs font-medium 
                      bg-white/20 rounded-full text-white animate-pulse">
                      Enabled ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-between pt-8 border-t border-white/10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl 
                bg-white/10 border border-white/20 hover:bg-white/20
                font-semibold text-gray-300 tracking-wide transition">
              <HiArrowLeft /> Back
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-10 py-3 rounded-2xl font-bold tracking-wide
                bg-gradient-to-r from-blue-600 to-cyan-500 text-white
                hover:scale-105 active:scale-95 transition shadow-xl shadow-blue-600/40
                disabled:opacity-50">
              {loading ? "Saving..." : "Save Permissions"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
