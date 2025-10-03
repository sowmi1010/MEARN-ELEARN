// src/pages/admin/MentorAccess.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import {
  FaTachometerAlt,
  FaBook,
  FaUserGraduate,
  FaMoneyBillWave,
  FaTable,
  FaArrowLeft,
} from "react-icons/fa";

const availablePermissions = [
  { key: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { key: "students", label: "Enrolled Students", icon: <FaUserGraduate /> },
  { key: "courses", label: "Courses", icon: <FaBook /> },
  { key: "videos", label: "Manage Videos", icon: <FaTable /> },
  { key: "payments", label: "Payments", icon: <FaMoneyBillWave /> },
];

export default function MentorAccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

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
    } catch (err) {
      console.error("❌ Fetch mentor permissions error:", err.response?.data || err.message);
    }
  }

  function togglePermission(key) {
    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((p) => p !== key)
        : [...prev, key]
    );
  }

  async function handleSubmit() {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/mentor/${id}/permissions`,
        { permissions: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Mentor permissions updated!");
      navigate("/admin/mentors");
    } catch (err) {
      console.error("❌ Update permissions error:", err.response?.data || err.message);
      alert("❌ Failed to update permissions");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBg text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* === Header Bar === */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 py-8 shadow-lg text-white">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide">
            👨‍🏫 Assign Mentor Access
          </h1>
          <span className="text-sm italic opacity-90">Step 2 of 2</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="bg-white/90 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-8 space-y-8">
          {/* Info */}
          <p className="text-gray-600 dark:text-gray-300 text-center">
            ✅ Select which <span className="text-teal-500 font-semibold">modules</span> this mentor can access by clicking below:
          </p>

          {/* Permission Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePermissions.map((p) => (
              <div
                key={p.key}
                onClick={() => togglePermission(p.key)}
                className={`cursor-pointer flex flex-col items-center justify-center p-6 rounded-xl border transition-all transform hover:scale-105 shadow-sm ${
                  selected.includes(p.key)
                    ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg border-teal-400 hover:shadow-xl"
                    : "bg-gray-50 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-teal-400/70"
                }`}
              >
                <div className="text-4xl mb-3 drop-shadow">{p.icon}</div>
                <span className="font-semibold text-center">{p.label}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold shadow hover:scale-105 transition"
            >
              <FaArrowLeft /> Back
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-lg font-bold bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md hover:scale-105 hover:shadow-lg transition"
            >
              ✅ Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
