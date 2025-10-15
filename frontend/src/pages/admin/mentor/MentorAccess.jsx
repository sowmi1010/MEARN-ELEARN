import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";
import {
  HiOutlineChartBar,
  HiOutlineBookOpen,
  HiOutlineUserGroup,
  HiOutlinePlayCircle,
  HiOutlineCurrencyRupee,
  HiArrowLeft,
  HiShieldCheck,
} from "react-icons/hi2";

const availablePermissions = [
  { key: "dashboard", label: "Dashboard", icon: <HiOutlineChartBar /> },
  { key: "students", label: "Enrolled Students", icon: <HiOutlineUserGroup /> },
  { key: "courses", label: "Courses", icon: <HiOutlineBookOpen /> },
  { key: "videos", label: "Manage Videos", icon: <HiOutlinePlayCircle /> },
  { key: "payments", label: "Payments", icon: <HiOutlineCurrencyRupee /> },
];

export default function MentorAccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
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
    } catch (err) {
      console.error("Fetch mentor permissions error:", err);
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
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/mentor/${id}/permissions`,
        { permissions: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Mentor permissions updated!");
      navigate("/admin/mentors");
    } catch (err) {
      console.error("Update permissions error:", err);
      alert("Failed to update permissions");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* ===== Header Bar ===== */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-6 flex justify-between items-center border-b border-gray-700">
          <div className="flex items-center gap-3">
            <HiShieldCheck className="text-3xl" />
            <h1 className="text-2xl font-bold tracking-wide">
              Assign Mentor Access
            </h1>
          </div>
          <span className="text-sm italic text-white/80">Step 2 of 2</span>
        </div>

        {/* ===== Content Section ===== */}
        <div className="p-8 space-y-10">
          <p className="text-gray-400 text-center">
            Select which{" "}
            <span className="text-teal-400 font-semibold">modules</span> this
            mentor can access by clicking below.
          </p>

          {/* ===== Permission Grid ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePermissions.map((p) => (
              <div
                key={p.key}
                onClick={() => togglePermission(p.key)}
                className={`cursor-pointer flex flex-col items-center justify-center p-8 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  selected.includes(p.key)
                    ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-lg border-blue-400"
                    : "bg-gray-800/70 border-gray-700 hover:border-teal-400"
                }`}
              >
                <div
                  className={`text-4xl mb-3 ${
                    selected.includes(p.key)
                      ? "text-white drop-shadow-md"
                      : "text-teal-400"
                  }`}
                >
                  {p.icon}
                </div>
                <span className="font-semibold text-center">{p.label}</span>
              </div>
            ))}
          </div>

          {/* ===== Buttons ===== */}
          <div className="flex justify-between pt-8 border-t border-gray-700">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold shadow-md hover:scale-105 transition"
            >
              <HiArrowLeft /> Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md hover:scale-105 hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Complete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
