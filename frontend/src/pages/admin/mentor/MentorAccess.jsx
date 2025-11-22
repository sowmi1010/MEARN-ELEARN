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

/* ✅ FULL LIST */
const availablePermissions = [
  { key: "dashboard", label: "Dashboard", icon: <HiOutlineChartBar /> },
  { key: "home", label: "Home Page", icon: <HiOutlineHome /> },
  { key: "courses", label: "Courses", icon: <HiOutlineBookOpen /> },
  { key: "admin", label: "Admin", icon: <HiOutlineUser /> },
  { key: "mentor", label: "Mentor", icon: <HiOutlineUserGroup /> },
  { key: "students", label: "Student", icon: <HiOutlineUsers /> },
  { key: "payments", label: "Payments", icon: <HiOutlineCurrencyRupee /> },
];

export default function MentorAccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);
  const [mentorName, setMentorName] = useState("");
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

  function togglePermission(key) {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  }

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

      alert("✅ Permissions updated successfully!");
      navigate("/admin/mentors");
    } catch {
      alert("❌ Failed to update permissions");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl border border-blue-500/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <HiShieldCheck className="text-3xl" />
            <h1 className="text-2xl font-bold">
              Set Access : {mentorName}
            </h1>
          </div>

          <span className="text-white/80 text-sm flex items-center gap-1">
            <HiCheckBadge /> Step 2 / 2
          </span>
        </div>


        <div className="p-8 space-y-8">

          {/* CONTROLS */}
          <div className="flex justify-between items-center">
            <p className="text-gray-400">
              Select modules the mentor can access
            </p>

            <div className="flex gap-3">
              <button
                onClick={selectAll}
                className="bg-blue-500/20 border border-blue-500 px-4 py-1.5 rounded-lg text-sm hover:bg-blue-500 transition"
              >
                Select All
              </button>

              <button
                onClick={clearAll}
                className="bg-red-500/20 border border-red-500 px-4 py-1.5 rounded-lg text-sm hover:bg-red-500 transition"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePermissions.map((p) => {
              const active = selected.includes(p.key);

              return (
                <div
                  key={p.key}
                  onClick={() => togglePermission(p.key)}
                  className={`cursor-pointer group p-6 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 hover:scale-105
                    ${
                      active
                        ? "bg-gradient-to-r from-blue-500 to-teal-400 border-blue-500 shadow-xl"
                        : "bg-black/40 border-gray-700 hover:border-blue-500"
                    }
                  `}
                >
                  <div
                    className={`text-4xl mb-3 ${
                      active ? "text-white" : "text-teal-400"
                    }`}
                  >
                    {p.icon}
                  </div>

                  <h3 className="font-semibold text-lg">{p.label}</h3>

                  {active && (
                    <span className="mt-2 text-xs bg-black/30 px-3 py-1 rounded-full">
                      Enabled ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between pt-6 border-t border-gray-700">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 font-semibold"
            >
              <HiArrowLeft /> Back
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 hover:scale-105 transition font-semibold shadow-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Access"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
