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

  const getFile = (path) => {
    if (!path) return "";
    const clean = path.replace(/\\/g, "/").replace(/^.*uploads\//, "uploads/");
    if (clean.startsWith("http")) return clean;
    return `${BASE}/${clean}`;
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050813] text-white">
        Loading Notes...
      </div>
    );

  if (!note)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050813] text-red-400">
        Notes not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050813] text-white px-6 py-10">
      {/* MAIN */}
      <div className="max-w-6xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl grid md:grid-cols-3 gap-6">
        {/* NOTE VIEWER */}
        <div className="md:col-span-2 space-y-5">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaStickyNote className="text-cyan-400" />
            {note.title}
          </h1>

          {note.file ? (
            <iframe
              src={getFile(note.file)}
              title="Notes Viewer"
              className="w-full h-[520px] rounded-xl border border-cyan-500/20 bg-black"
            />
          ) : (
            <p className="text-gray-400">No file uploaded.</p>
          )}

          {/* DESCRIPTION */}
          <div className="mt-4 bg-black/50 p-4 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold mb-1 text-cyan-400">
              Description
            </h3>
            <p className="text-gray-300">
              {note.description || "No description provided"}
            </p>
          </div>
        </div>

        {/* SIDE INFO */}
        <div className="space-y-5 bg-black/40 p-6 rounded-xl border border-white/10">
          {note.thumbnail && (
            <img
              src={getFile(note.thumbnail)}
              alt="Thumbnail"
              className="w-full h-40 object-cover rounded-lg border border-white/10 mb-4"
            />
          )}

          <Info label="Group" value={note.group} />
          <Info label="Standard" value={note.standard} />
          <Info label="Board" value={note.board} />
          <Info label="Language" value={note.language} />
          <Info label="Subject" value={note.subject} />
          <Info label="Lesson" value={note.lesson} />
          <Info label="Category" value={note.category} />
          <Info label="Note No" value={note.noteNumber || "-"} />
        </div>
      </div>
    </div>
  );
}

/* Info row */
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium">{value || "-"}</p>
  </div>
);
