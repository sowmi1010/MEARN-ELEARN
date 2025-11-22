import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";

export default function Courses() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadMyCourses();
  }, []);

  function formatGroup(name) {
    if (!name) return "UNKNOWN";
    const upper = name.toUpperCase();
    if (upper.includes("ROOT")) return "ROOT";
    if (upper.includes("STEM")) return "STEM";
    if (upper.includes("LEAF")) return "LEAF";
    if (upper.includes("SEED")) return "SEED";
    if (upper.includes("FRUIT")) return "FRUIT";
    if (upper.includes("FLOWER")) return "FLOWER";
    return upper;
  }

  async function loadMyCourses() {
    try {
      const res = await api.get("/payments/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const payments = res.data.payments || [];
      const grouped = {};

      payments.forEach((payment) => {
        const group = formatGroup(payment.metadata?.group);
        if (!grouped[group]) grouped[group] = payment;
      });

      setGroups(Object.values(grouped));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-400 text-xl">
        Loading your universe...
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No courses purchased yet
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05010f] via-[#0a0320] to-[#12062f] text-white px-6 py-10 relative overflow-hidden">
      {/* BACKGROUND ORBS */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-700/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-10 right-20 w-96 h-96 bg-pink-600/20 blur-[150px] rounded-full"></div>

      <h1 className="text-4xl font-extrabold text-purple-400 mb-12">
        My Learning Universe
      </h1>

      <div className="relative border-l-2 border-purple-500/30 pl-10 space-y-16">
        {groups.map((payment, index) => {
          const group = formatGroup(payment.metadata?.group);

          const standard = payment.metadata?.standard;
          const board = payment.metadata?.board;
          const language = payment.metadata?.language;
          const title = payment.metadata?.title;
          const groupCode = payment.metadata?.groupCode;

          return (
            <div
              key={payment._id}
              className="relative group flex flex-col md:flex-row md:items-center gap-8 hover:translate-x-2 transition-all duration-500"
            >
              {/* GLOW DOT */}
              <span className="absolute -left-[15px] top-6 w-6 h-6 bg-purple-500 rounded-full shadow-[0_0_25px_#a855f7]"></span>

              {/* CONTENT */}
              <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">
                <h2 className="text-3xl font-bold text-cyan-400">
                  {group} GROUP
                </h2>

                {standard && (
                  <p className="text-gray-400 mt-2">
                    {standard} • {board} • {language}
                  </p>
                )}

                {groupCode && (
                  <p className="text-sm text-yellow-400 mt-1">{groupCode}</p>
                )}

                {!standard && title && (
                  <p className="text-gray-400 mt-2">{title}</p>
                )}

                <p className="text-sm text-purple-300 mt-3">
                  Purchased: {new Date(payment.createdAt).toDateString()}
                </p>

                <div className="flex items-center justify-between mt-6">
                  <p className="text-2xl font-bold text-green-400">
                    ₹ {payment.amount}
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/student/courses/${group.toLowerCase()}`)
                    }
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 rounded-xl text-white font-semibold shadow-lg transition"
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
