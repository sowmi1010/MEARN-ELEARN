import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";
import { FaArrowLeft, FaStickyNote } from "react-icons/fa";

export default function ViewNotes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE = "http://localhost:4000";

  const cleanPath = (path) => {
    if (!path) return "";
    const fixed = path.replace(/\\/g, "/").replace(/^.*uploads\//, "uploads/");
    return fixed.startsWith("http") ? fixed : `${BASE}/${fixed}`;
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (err) {
        console.error("Error loading notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#020617] text-cyan-400 flex items-center justify-center text-xl">
        Loading Notes...
      </div>
    );

  if (!note)
    return (
      <div className="min-h-screen bg-[#020617] text-red-400 flex items-center justify-center text-xl">
        Notes not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a1124] to-[#1e293b] text-white px-6 py-10">



      {/* MAIN CARD */}
      <div className="
        max-w-8xl mx-auto 
        grid md:grid-cols-3 gap-10 
        p-10 
        bg-white/5 backdrop-blur-xl 
        border border-white/10 
        rounded-3xl shadow-2xl shadow-cyan-900/30
      ">

        {/* LEFT SIDE — NOTES VIEW + TITLE */}
        <div className="md:col-span-2 space-y-8">

          {/* TITLE */}
          <h1 className="text-4xl font-bold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
            <FaStickyNote className="text-cyan-300 drop-shadow" />
            {note.title}
          </h1>

          {/* PDF VIEW */}
          {note.file ? (
            <iframe
              src={cleanPath(note.file)}
              title="Notes Viewer"
              className="w-full h-[550px] rounded-2xl border border-cyan-400/30 bg-black shadow-lg"
            />
          ) : (
            <p className="text-gray-400">No notes file available.</p>
          )}

          {/* DESCRIPTION */}
          <div className="bg-black/40 p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-cyan-300 mb-2">Description</h3>
            <p className="text-gray-300 leading-relaxed">
              {note.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE — INFO PANEL */}
        <div className="bg-black/40 p-6 rounded-2xl border border-white/10 shadow-xl space-y-6">

          {/* THUMBNAIL */}
          {note.thumbnail && (
            <img
              src={cleanPath(note.thumbnail)}
              alt="Notes Thumbnail"
              className="w-full h-44 object-cover rounded-xl border border-cyan-400/20 shadow-lg"
            />
          )}

          <Info label="Group" value={note.group} />
          <Info label="Standard" value={note.standard} />
          <Info label="Board" value={note.board} />
          <Info label="Language" value={note.language} />
          <Info label="Subject" value={note.subject} />
          <Info label="Lesson" value={note.lesson} />
          <Info label="Category" value={note.category} />
          <Info label="Note Number" value={note.noteNumber || "-"} />

        </div>
      </div>
    </div>
  );
}

/* Reusable Info Component */
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="text-[15px] font-semibold text-cyan-300">{value || "-"}</p>
  </div>
);
