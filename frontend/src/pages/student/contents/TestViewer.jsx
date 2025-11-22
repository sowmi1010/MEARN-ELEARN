import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function TestViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    async function loadTest() {
      setLoading(true);
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

  if (loading)
    return <div className="text-gray-300 p-6">Loading test...</div>;

  if (!test)
    return <div className="text-red-400 p-6">Test not found.</div>;

  // Normalize paths
  const filePath = (test.file || "").replace(/^\/+/, "");
  const fileUrl = `${BASE_URL}/${filePath}`;

  const isPDF = filePath.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);

  return (
    <div className="min-h-screen p-6 bg-[#0b0f1a] text-gray-100">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-purple-400">
            {test.title}
          </h1>
          <p className="text-gray-400 mt-1">
            {test.subject} • {test.standard} • {test.language}
          </p>
        </div>

      </div>

      {/* Viewer */}
      <div className="bg-[#111827] rounded-xl shadow-xl border border-purple-800/30 overflow-hidden">

        {isPDF ? (
          <iframe
            src={fileUrl}
            className="w-full h-[85vh] bg-black"
            title="Test Viewer"
          ></iframe>
        ) : isImage ? (
          <div className="flex items-center justify-center bg-black h-[85vh]">
            <img
              src={fileUrl}
              alt="Test"
              className="max-h-[85vh] object-contain"
            />
          </div>
        ) : (
          <div className="p-6 text-gray-300">
            This file cannot be previewed directly.{" "}
            <a className="text-purple-300 underline" href={fileUrl} target="_blank" rel="noreferrer">
              Download / Open
            </a>
          </div>
        )}

      </div>

      {/* Download Button */}
      <a
        href={fileUrl}
        download
        className="
          mt-6 inline-block 
          bg-purple-600 
          hover:bg-purple-700 
          px-5 py-2 
          rounded-lg 
          shadow-md shadow-purple-900/40 
          transition
        "
      >
        Download Test
      </a>
    </div>
  );
}
