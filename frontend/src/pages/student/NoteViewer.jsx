import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function NoteViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    async function loadNote() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await api.get(`/notes/${id}`, { headers });
        setNote(res.data);
      } catch (err) {
        console.error("Failed to load note:", err);
      } finally {
        setLoading(false);
      }
    }

    loadNote();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-300">Loading...</div>;
  if (!note) return <div className="p-6 text-red-400">Note not found.</div>;

  const filePath = (note.file || "").replace(/^\/+/, "");
  const fileUrl = `${BASE_URL}/${filePath}`;

  const isPDF = filePath.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
  const isDoc = /\.(doc|docx)$/i.test(filePath);

  return (
    <div className="p-6 min-h-screen bg-[#0b0f1a] text-gray-100">
      
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-purple-400">
            {note.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {note.subject} • {note.lesson}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-sm text-white"
          >
            Open File
          </a>
        </div>
      </div>

      {/* VIEWER BOX */}
      <div className="bg-[#081024] rounded-2xl overflow-hidden border border-purple-800/30 shadow-xl p-4">
        
        {isPDF ? (
          // PDF VIEWER
          <iframe
            src={fileUrl}
            className="w-full h-[85vh] rounded-xl shadow-inner bg-black"
            title={note.title}
          />

        ) : isImage ? (
          // IMAGE VIEWER
          <div className="w-full flex justify-center">
            <img
              src={fileUrl}
              alt={note.title}
              className="max-h-[85vh] rounded-xl object-contain shadow-xl"
            />
          </div>

        ) : isDoc ? (
          // DOC / DOCX
          <div className="p-6 text-center text-gray-300">
            <p className="text-lg mb-3 font-medium">Word Document</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg inline-block"
            >
              Click to Open Document
            </a>
          </div>

        ) : (
          // UNKNOWN FILE
          <div className="p-6 text-gray-300 text-center">
            This file format cannot be previewed.
            <br />
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-purple-300 underline mt-2 inline-block"
            >
              Open / Download File
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
