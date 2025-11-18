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

  // detect file type
  const isPDF = filePath.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);

  return (
    <div className="p-6 min-h-screen bg-[#0b0f1a] text-gray-100">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-400">{note.title}</h1>
          <p className="text-sm text-gray-400">
            {note.subject} • {note.lesson}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="px-3 py-2 rounded bg-gray-800">Back</button>
          <a href={fileUrl} target="_blank" rel="noreferrer" className="px-3 py-2 rounded bg-purple-600">Open Raw</a>
        </div>
      </div>

      <div className="bg-[#081024] rounded-xl overflow-hidden shadow-lg">
        {isPDF ? (
          <iframe
            src={fileUrl}
            title={note.title}
            className="w-full h-[85vh] bg-black"
          />
        ) : isImage ? (
          <img src={fileUrl} alt={note.title} className="w-full object-contain max-h-[85vh]" />
        ) : (
          <div className="p-6 text-gray-300">
            File type not previewable in browser. <a className="text-purple-300" href={fileUrl} target="_blank" rel="noreferrer">Download/Open</a>
          </div>
        )}
      </div>
    </div>
  );
}
