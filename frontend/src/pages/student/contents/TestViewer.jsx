import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function TestViewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  /* -----------------------------------------------------
        LOAD TEST
  ------------------------------------------------------*/
  useEffect(() => {
    async function loadTest() {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await api.get(`/tests/${id}`, { headers });
        setTest(res.data || null);
      } catch (err) {
        console.error("Failed to load test:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTest();
  }, [id]);

  /* -----------------------------------------------------
        STATES
  ------------------------------------------------------*/
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
        <div className="text-gray-300 animate-pulse">Loading test…</div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] text-red-400">
        Test not found.
      </div>
    );
  }

  /* -----------------------------------------------------
        FILE TYPE DETECTION
  ------------------------------------------------------*/
  const filePath = (test.file || "").replace(/^\/+/, "");
  const fileUrl = `${BASE_URL}/${filePath}`;

  const isPDF = filePath.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
  const isDoc = /\.(doc|docx)$/i.test(filePath);

  /* -----------------------------------------------------
        UI
  ------------------------------------------------------*/
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080812] to-[#0b0f1a] p-4 sm:p-6 text-gray-100">

      {/* ---------- HEADER ---------- */}
      <div
        className="
          sticky top-0 z-20 mb-6
          backdrop-blur-xl bg-[#0e0e18]/70
          border border-purple-900/40 shadow-lg shadow-black/40
          rounded-xl px-4 py-4
          flex items-center justify-between
        "
      >
   

        <div className="flex-1 text-center px-2">
          <h1 className="text-xl sm:text-2xl font-bold text-purple-300">
            {test.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {test.subject} • Std {test.standard} • {test.language}
          </p>
        </div>

        <div className="w-20 opacity-0">btn</div>
      </div>

      {/* ---------- VIEWER ---------- */}
      <div
        className="
          rounded-2xl overflow-hidden
          border border-purple-900/40
          bg-[#0f1020]
          shadow-2xl shadow-black/60
          p-4
        "
      >
        {isPDF && (
          <iframe
            src={fileUrl}
            title="PDF Test Viewer"
            className="w-full h-[78vh] sm:h-[85vh] md:h-[88vh] bg-black rounded-xl"
          />
        )}

        {isImage && (
          <div className="w-full flex items-center justify-center bg-black rounded-xl">
            <img
              src={fileUrl}
              alt={test.title}
              className="max-h-[85vh] rounded-xl object-contain shadow-xl"
            />
          </div>
        )}

        {isDoc && (
          <div className="py-10 text-center text-gray-300">
            <p className="text-lg font-medium mb-3">📄 Word Document</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-900/40"
            >
              Open Document
            </a>
          </div>
        )}

        {!isPDF && !isImage && !isDoc && (
          <div className="py-10 text-center text-gray-300">
            This format cannot be previewed.
            <br />
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-purple-300 underline"
            >
              Download / Open File
            </a>
          </div>
        )}
      </div>

      {/* ---------- DOWNLOAD BUTTON ---------- */}
      <div className="flex justify-center mt-8">
        <a
          href={fileUrl}
          download
          className="
            px-6 py-3 bg-purple-700 hover:bg-purple-800
            rounded-xl text-white shadow-lg shadow-purple-900/40
            transition-all
          "
        >
          ⬇ Download Test
        </a>
      </div>
    </div>
  );
}
