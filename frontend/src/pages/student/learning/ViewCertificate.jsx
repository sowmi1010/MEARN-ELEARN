import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useParams, useNavigate } from "react-router-dom";

export default function ViewCertificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cert, setCert] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/certificate/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCert(res.data);
      } catch (err) {
        console.error("Failed to load certificate:", err);
      }
    }
    load();
  }, [id]);

  if (!cert)
    return (
      <div className="p-10 text-gray-300 text-xl flex justify-center items-center min-h-screen">
        Loading certificate…
      </div>
    );

  const fileURL = `${BASE_URL}/${cert.file}`;

  const isPDF = cert.file?.endsWith(".pdf");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070B16] to-[#0D1224] text-gray-100 p-8">
      
      {/* Header Buttons */}
      <div className="flex justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-purple-700 hover:bg-purple-800 px-5 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          ⬅ Back
        </button>

        <a
          href={fileURL}
          download
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          ⬇ Download
        </a>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-extrabold text-center text-purple-300 mb-8 tracking-wide">
        Certificate Preview 🎖️
      </h1>

      {/* Certificate Container */}
      <div className="flex justify-center">
        <div
          className="
            bg-[#0f1629]/50 
            p-6 rounded-2xl border border-purple-800/30 
            backdrop-blur-xl shadow-2xl 
            max-w-4xl w-full
          "
        >
          {/* PDF View */}
          {isPDF ? (
            <iframe
              src={fileURL}
              className="w-full h-[85vh] rounded-lg shadow-lg border border-purple-900"
            ></iframe>
          ) : (
            <img
              src={fileURL}
              alt="Certificate"
              className="
                w-full rounded-xl shadow-2xl 
                border border-purple-900 
                hover:scale-[1.01] transition
              "
            />
          )}
        </div>
      </div>
    </div>
  );
}
