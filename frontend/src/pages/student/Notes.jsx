import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    loadNotes(); // load default
  }, []);

  // 🟣 LISTEN TO GLOBAL SEARCH (from StudentLayout)
  useEffect(() => {
    const handler = (e) => {
      const text = e.detail || "";
      loadNotes(text);
    };

    window.addEventListener("global-search", handler);
    return () => window.removeEventListener("global-search", handler);
  }, []);

  async function loadNotes(searchText = "") {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await api.get("/notes", {
        headers,
        params: { search: searchText },
      });

      setNotes(res.data || []);
    } catch (err) {
      console.error("Failed to load notes", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] p-8 text-gray-100">
      <h1 className="text-3xl font-bold text-purple-400">Notes</h1>

      {/* Notes Timeline */}
      <div className="mt-10 space-y-6 relative">

        {/* Side Line */}
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-purple-900/40"></div>

        {loading && <div className="text-gray-400 ml-10">Loading notes...</div>}

        {!loading && notes.length === 0 && (
          <div className="text-gray-400 ml-10">No notes found.</div>
        )}

        {notes.map((note, index) => {
          const thumb = note.thumbnail
            ? `${BASE_URL}/${note.thumbnail.replace(/^\/+/, "")}`
            : "/default-thumbnail.png";

          return (
            <div key={note._id} className="ml-10 relative group transition">
              <div className="absolute -left-[34px] top-5 w-4 h-4 rounded-full bg-purple-600 shadow-lg shadow-purple-500/30"></div>

              <div
                className="bg-[#111827] hover:bg-[#1a2338] border border-purple-800/20 p-5 rounded-xl shadow-lg transition flex items-start gap-5 cursor-pointer"
                onClick={() => navigate(`/student/notes/view/${note._id}`)}
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={thumb} className="w-full h-full object-cover" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-purple-300">
                    {note.title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {note.subject} • {note.lesson}
                  </p>
                  <p className="text-gray-300 mt-2 line-clamp-2 text-[15px]">
                    {note.description || ""}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
