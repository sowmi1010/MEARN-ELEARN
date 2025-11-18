import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Basic client-side filters (optional)
  const [filters, setFilters] = useState({
    subject: "",
    lesson: "",
    search: "",
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadNotes() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get("/notes", { headers, params: {} });
      setNotes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load notes", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = notes.filter((n) => {
    const s = (n.subject || "").toLowerCase();
    const l = (n.lesson || "").toLowerCase();
    const q = (filters.search || "").toLowerCase();
    if (filters.subject && !s.includes(filters.subject.toLowerCase())) return false;
    if (filters.lesson && !l.includes(filters.lesson.toLowerCase())) return false;
    if (q && !((n.title || "").toLowerCase().includes(q) || (n.description || "").toLowerCase().includes(q)))
      return false;
    return true;
  });

  return (
    <div className="p-6 text-gray-100 min-h-screen bg-[#0b0f1a]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-purple-400">Notes</h1>
        <div className="flex gap-2">
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search title or description..."
            className="px-3 py-2 rounded bg-[#0f172a] text-sm border border-purple-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <div className="text-gray-400">Loading notes...</div>}

        {!loading && filtered.length === 0 && (
          <div className="text-gray-400">No notes found.</div>
        )}

        {filtered.map((note) => {
          // normalize thumbnail path and build full URL
          const thumbPath = (note.thumbnail || "").replace(/^\/+/, "");
          const thumbUrl = thumbPath ? `${BASE_URL}/${thumbPath}` : "/default-thumbnail.png";

          return (
            <div key={note._id} className="bg-[#081024] rounded-xl overflow-hidden shadow-lg">
              <div className="w-full h-44 bg-black/20 overflow-hidden">
                <img
                  src={thumbUrl}
                  alt={note.title}
                  onError={(e) => (e.currentTarget.src = "/default-thumbnail.png")}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-purple-300">{note.title}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {note.subject} • {note.lesson}
                </p>
                <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                  {note.description || ""}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => navigate(`/student/notes/view/${note._id}`)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
                  >
                    View Notes
                  </button>

                  <a
                    href={`${BASE_URL}/${(note.file || "").replace(/^\/+/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 border border-purple-700 rounded text-sm text-purple-200 hover:bg-purple-800/20"
                  >
                    Open
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
