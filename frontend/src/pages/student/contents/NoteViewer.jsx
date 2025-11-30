import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function NoteViewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  /* --------------------------------------------
        LOAD NOTE
  -------------------------------------------- */
  useEffect(() => {
    async function fetchNote() {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await api.get(`/notes/${id}`, { headers });
        setNote(res.data);
      } catch (err) {
        console.error("Error loading note:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [id]);

  /* --------------------------------------------
        LOADING STATE
  -------------------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center">
        <div className="text-gray-400 animate-pulse text-lg">Loading note…</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex flex-col items-center justify-center text-gray-300">
        <p className="text-xl">❌ Note not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-purple-700 hover:bg-purple-800 px-6 py-2 rounded-lg text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  /* --------------------------------------------
        FILE HANDLING
  -------------------------------------------- */
  const filePath = note.file?.replace(/^\/+/, "") || "";
  const fileUrl = `${BASE_URL}/${filePath}`;

  const isPDF = filePath.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
  const isDoc = /\.(doc|docx)$/i.test(filePath);

  /* --------------------------------------------
        FINAL UI
  -------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080812] to-[#0b0f1a] p-4 sm:p-6 text-gray-100">

      {/* ---------------- HEADER ---------------- */}
      <div
        className="
          sticky top-0 z-30
          flex items-center justify-between
          backdrop-blur-xl bg-[#0d0d17]/70
          border border-purple-900/40
          shadow-lg shadow-black/40
          px-4 py-4 rounded-xl mb-6
        "
      >
   

        <div className="flex-1 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-purple-300 tracking-wide">
            {note.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {note.subject} • {note.lesson}
          </p>
        </div>

        <div className="w-20 opacity-0">btn</div>
      </div>

      {/* ---------------- VIEWER BOX ---------------- */}
      <div
        className="
          rounded-2xl overflow-hidden
          border border-purple-900/40
          bg-[#0e0e18] 
          shadow-2xl shadow-black/50
          p-4
        "
      >
        {isPDF && (
          <iframe
            src={fileUrl}
            title="PDF Viewer"
            className="w-full h-[78vh] sm:h-[85vh] md:h-[88vh] bg-black rounded-xl"
          />
        )}

        {isImage && (
          <div className="w-full flex justify-center">
            <img
              src={fileUrl}
              alt={note.title}
              className="max-h-[80vh] rounded-xl object-contain shadow-xl"
            />
          </div>
        )}

        {isDoc && (
          <div className="text-center py-10 text-gray-300">
            <p className="text-lg mb-4 font-medium">📄 Word Document</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                px-6 py-3 bg-purple-600 hover:bg-purple-700
                rounded-xl text-white shadow-purple-900/40 shadow-md
              "
            >
              Open Document
            </a>
          </div>
        )}

        {!isPDF && !isImage && !isDoc && (
          <div className="text-center text-gray-300 py-10">
            Unknown file format.
            <br />
            <a
              href={fileUrl}
              className="mt-3 inline-block text-purple-300 underline"
              target="_blank"
            >
              Open / Download File
            </a>
          </div>
        )}
      </div>

      {/* ---------------- DOWNLOAD BUTTON ---------------- */}
      <div className="flex justify-center mt-6">
        <a
          href={fileUrl}
          download
          className="
            px-6 py-3 bg-purple-700 hover:bg-purple-800 
            rounded-xl shadow-md shadow-purple-900/40 
            text-white font-medium transition-all
          "
        >
          ⬇ Download Note
        </a>
      </div>

    </div>
  );
}
