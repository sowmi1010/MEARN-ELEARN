import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";

export default function ManageNotes() {
  const { groupId, subject, category } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Group Mapping (ObjectId → Name)
  const groupMap = {
    "68e776aaa084762b3d385c1c": "ROOT",
    "68e777aaa084762b3d385c1d": "STEM",
    "68e778aaa084762b3d385c1e": "LEAF",
    "68e779aaa084762b3d385c1f": "FLOWER",
    "68e77aaaa084762b3d385c20": "FRUIT",
    "68e77baaa084762b3d385c21": "SEED",
  };

  //  Category Color Mapping
  const categoryColors = {
    "lesson notes": "bg-blue-700",
    summary: "bg-green-700",
    "question bank": "bg-purple-700",
    "one word": "bg-yellow-700",
    important: "bg-orange-700",
    others: "bg-gray-700",
  };

  // Helper to clean backend paths
  const normalizePath = (path) => {
    if (!path) return "";
    return path.replace(/^.*uploads[\\/]/, "uploads/").replace(/\\/g, "/");
  };

  useEffect(() => {
    fetchNotes();
  }, [groupId, subject, category]);

  // Fetch Notes from Backend
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const groupName = groupMap[groupId] || groupId;

      const normalizedCategory = category
        .trim()
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      const res = await api.get(
        `/notes?group=${groupName}&subject=${subject}&category=${encodeURIComponent(
          normalizedCategory
        )}`
      );

      // Ensure clean URLs (supports both virtual URLs and raw paths)
      const formattedNotes = (res.data || []).map((note) => ({
        ...note,
        thumbnailUrl: note.thumbnailUrl
          ? note.thumbnailUrl
          : `http://localhost:4000/${normalizePath(note.thumbnail)}`,
        fileUrl: note.fileUrl
          ? note.fileUrl
          : `http://localhost:4000/${normalizePath(note.file)}`,
      }));

      setNotes(formattedNotes);
    } catch (err) {
      console.error("❌ Failed to fetch notes:", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete Note
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      alert("Note deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed. Try again.");
    }
  };

  const color = categoryColors[category.toLowerCase()] || "bg-gray-700";

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold capitalize mb-2">
            {groupMap[groupId] || groupId} → {subject} → {category}
          </h1>
          <p className="text-gray-400">
            Showing all uploaded {category.toLowerCase()} notes for this subject.
          </p>
        </div>
      </div>

      {/* Notes List */}
      {loading ? (
        <p className="text-center text-gray-400">Loading notes...</p>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              color={color}
              onEdit={() => navigate(`/admin/courses/edit/notes/${note._id}`)}
              onView={() => navigate(`/admin/courses/view/note/${note._id}`)}
              onDelete={() => handleDelete(note._id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic">
          No notes found for this subject.
        </p>
      )}
    </div>
  );
}

// Single Note Card Component
function NoteCard({ note, color, onEdit, onView, onDelete }) {
  return (
    <div
      className={`rounded-xl p-4 shadow-md ${color} hover:scale-[1.03] hover:shadow-xl transition-all duration-300`}
    >
      {/* Thumbnail */}
      {note.thumbnailUrl ? (
        <img
          src={note.thumbnailUrl}
          alt={note.title}
          className="rounded-md w-full h-40 object-cover mb-3 border border-gray-800"
        />
      ) : (
        <div className="h-40 bg-gray-700 flex items-center justify-center rounded-md mb-3">
          <span className="text-gray-300 italic">No Thumbnail</span>
        </div>
      )}

      {/* Title & Info */}
      <h3 className="text-lg font-semibold mb-1 truncate">{note.title}</h3>
      {note.language && <p className="text-sm text-gray-300">🌐 {note.language}</p>}
      {note.category && <p className="text-sm text-gray-300 mb-1">{note.category}</p>}
      {note.description && (
        <p className="text-sm text-gray-200 mt-2 line-clamp-2">
          {note.description}
        </p>
      )}

      {/* File Button */}
      {note.fileUrl && (
        <a
          href={note.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-3 bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 rounded text-sm font-medium"
        >
          View File
        </a>
      )}

      {/* Admin Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={onEdit}
          className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 text-sm font-semibold"
        >
           Edit
        </button>

        <button
          onClick={onView}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm font-semibold"
        >
          View
        </button>

        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm font-semibold"
        >
           Delete
        </button>
      </div>
    </div>
  );
}
