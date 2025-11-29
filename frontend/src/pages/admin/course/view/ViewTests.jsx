import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";
import { FaArrowLeft, FaFileAlt } from "react-icons/fa";

export default function ViewTest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE = "http://localhost:4000";

  const getFile = (path) => {
    if (!path) return "";
    const clean = path.replace(/\\/g, "/").replace(/^.*uploads\//, "uploads/");
    return clean.startsWith("http") ? clean : `${BASE}/${clean}`;
  };

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get(`/tests/${id}`);
        setTest(res.data);
      } catch (err) {
        console.error("Test load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#020617] text-orange-400 text-xl">
        Loading Test...
      </div>
    );

  if (!test)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#020617] text-red-400 text-xl">
        Test not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a1124] to-[#1e293b] text-white px-6 py-10">
      {/* MAIN CARD */}
      <div
        className="
        max-w-8xl mx-auto
        bg-white/5 backdrop-blur-xl 
        border border-white/10 
        rounded-3xl p-8 
        shadow-2xl shadow-orange-900/20
        grid md:grid-cols-3 gap-6
      "
      >
        {/* LEFT — TEST FILE VIEW */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-orange-400 drop-shadow">
            <FaFileAlt />
            {test.title}
          </h1>

          {test.file ? (
            <iframe
              src={getFile(test.file)}
              title="Test PDF"
              className="w-full h-[520px] rounded-xl border border-orange-400/20 bg-black shadow-md shadow-black/40"
            />
          ) : (
            <p className="text-gray-400">No test file available</p>
          )}
        </div>

        {/* RIGHT — INFO PANEL */}
        <div
          className="
          space-y-5 
          bg-black/40 p-6 rounded-xl 
          border border-white/10 
          shadow-lg shadow-black/30
        "
        >
          {test.thumbnail && (
            <img
              src={getFile(test.thumbnail)}
              alt="Thumbnail"
              className="w-full h-44 object-cover rounded-lg border border-white/10 shadow"
            />
          )}

          <Info label="Group" value={test.group} />
          <Info label="Standard" value={test.standard} />
          <Info label="Board" value={test.board} />
          <Info label="Language" value={test.language} />
          <Info label="Subject" value={test.subject} />
          <Info label="Category" value={test.category} />
        </div>
      </div>
    </div>
  );
}

/* Reusable Info Component */
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    <p className="text-sm font-semibold text-orange-300 mt-1">{value || "-"}</p>
  </div>
);
