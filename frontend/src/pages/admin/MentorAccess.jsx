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

// ✅ Only show permissions that match AdminLayout tabs
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

  // 🔹 Load mentor’s current permissions
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

  // 🔹 Toggle permissions
  function togglePermission(key) {
    setSelected(prev =>
      prev.includes(key)
        ? prev.filter(p => p !== key)
        : [...prev, key]
    );
  }

  // 🔹 Save permissions
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
    <div className="p-8 bg-darkCard rounded-xl max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-accent">
          👨‍🏫 Add Mentor – Step 2: Assign Access
        </h1>
        <span className="text-gray-400 text-sm">Step 2 of 2</span>
      </div>

      {/* Permissions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {availablePermissions.map(p => (
          <div
            key={p.key}
            onClick={() => togglePermission(p.key)}
            className={`cursor-pointer flex flex-col items-center justify-center p-6 rounded-xl border transition transform hover:scale-105 ${
              selected.includes(p.key)
                ? "bg-gradient-to-r from-accent to-blue-500 text-darkBg border-accent shadow-lg"
                : "bg-gray-800 text-white border-gray-700 hover:border-accent"
            }`}
          >
            <div className="text-3xl mb-3">{p.icon}</div>
            <span className="font-semibold">{p.label}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
        >
          <FaArrowLeft /> Back
        </button>
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-accent text-darkBg font-bold rounded-lg shadow-lg hover:scale-105 transition"
        >
          ✅ Complete
        </button>
      </div>
    </div>
  );
}
