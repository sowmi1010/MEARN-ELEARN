import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";

export default function Certificate() {
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/certificate/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCertificates(res.data || []);
    } catch (err) {
      console.error("Failed to load certificates", err);
    }
  };

  if (certificates.length === 0)
    return (
      <div className="p-10 min-h-screen bg-[#070B16] flex flex-col items-center justify-center text-gray-300">
        <img
          src="https://cdn-icons-png.flaticon.com/512/679/679922.png"
          alt="No Certificate"
          className="w-32 mb-4 opacity-60"
        />
        <p className="text-2xl text-purple-300 font-semibold">
          No Certificates Yet 
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Complete a course to earn your first certificate
        </p>
      </div>
    );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-[#070B16] to-[#0D1224] text-gray-100">
      {/* HEADER */}
      <h1 className="text-4xl font-extrabold mb-10 text-center text-purple-400 tracking-wide">
        Your Achievements 🎖️
      </h1>

      {/* CERTIFICATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {certificates.map((c) => (
          <div
            key={c._id}
            className="
              group rounded-2xl p-4 
              bg-[#0F1629]/60 border border-purple-800/20 
              shadow-xl shadow-black/40
              backdrop-blur-xl transition-all 
              hover:shadow-purple-700/30 hover:scale-[1.03]
            "
          >
            {/* Certificate Frame */}
            <div
              className="w-full h-52 rounded-xl border border-purple-700/40 relative overflow-hidden shadow-lg"
              style={{
                backgroundImage: `url(${BASE_URL}/${c.thumbnail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/20 transition-all"></div>
            </div>

            {/* INFO */}
            <h2 className="text-xl font-bold mt-4 text-purple-300 truncate">
              {c.courseTitle}
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Awarded to:{" "}
              <span className="text-gray-200 font-medium">
                {c.studentName}
              </span>
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Issued on: {new Date(c.createdAt).toLocaleDateString()}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex justify-between mt-6">
              <button
                className="
                  bg-purple-600 hover:bg-purple-700 
                  px-4 py-2 rounded-lg text-sm shadow-md
                  transition-all
                "
                onClick={() => navigate(`/student/certificate/view/${c._id}`)}
              >
                View
              </button>

              <a
                href={`${BASE_URL}/${c.file}`}
                download
                className="
                  bg-green-600 hover:bg-green-700 
                  px-4 py-2 rounded-lg text-sm shadow-md transition-all
                "
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
