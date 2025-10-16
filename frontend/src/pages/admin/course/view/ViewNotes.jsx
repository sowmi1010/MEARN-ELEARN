import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";

export default function ViewNotes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileBase = "http://localhost:4000";

  // Normalize any backend path (old or new)
  const normalizePath = (path) => {
    if (!path) return "";
    // Remove drive letter (D:\mern-elearn\backend\...) if exists
    const cleaned = path.replace(/^.*uploads[\\/]/, "uploads/").replace(/\\/g, "/");
    return `${fileBase}/${cleaned}`;
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        const data = res.data;

        // Always include clean URLs (prefer backend virtuals)
        const noteWithCleanUrls = {
          ...data,
          thumbnailUrl: data.thumbnailUrl || normalizePath(data.thumbnail),
          fileUrl: data.fileUrl || normalizePath(data.file),
        };

        setNote(noteWithCleanUrls);
      } catch (err) {
        console.error("Failed to fetch note:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-300">
        Loading note details...
      </div>
    );

  if (!note)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-400">
        Note not found
      </div>
    );

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen flex flex-col items-center">
      {/* Back Button */}
      <div className="max-w-4xl w-full bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-4 text-center">{note.title}</h1>

        {/* Notes Viewer */}
        <div className="flex justify-center mb-6">
          {note.fileUrl ? (
            <iframe
              src={note.fileUrl}
              title="Note Preview"
              className="w-full h-[500px] rounded-lg border border-gray-700 shadow-md"
            />
          ) : (
            <p className="text-gray-400 italic">No file uploaded.</p>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-gray-300">
          <p><strong> Group:</strong> {note.group}</p>
          <p><strong> Standard:</strong> {note.standard}</p>
          <p><strong> Board:</strong> {note.board}</p>
          <p><strong> Language:</strong> {note.language}</p>
          <p><strong> Subject:</strong> {note.subject}</p>
          <p><strong> Lesson:</strong> {note.lesson}</p>
          <p><strong> Category:</strong> {note.category}</p>
          <p><strong> Note Number:</strong> {note.noteNumber || "—"}</p>
        </div>

        {/* Description */}
        <div className="mt-4">
          <h2 className="text-2xl font-semibold mb-2 text-pink-400">📝 Description</h2>
          <p className="text-gray-300 leading-relaxed">
            {note.description || "No description provided."}
          </p>
        </div>

        {/* Thumbnail Preview */}
        {note.thumbnailUrl && (
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold mb-2 text-blue-400">
              Thumbnail Preview
            </h3>
            <img
              src={note.thumbnailUrl}
              alt={note.title}
              className="rounded-lg w-64 mx-auto border border-gray-700"
            />
          </div>
        )}
      </div>
    </div>
  );
}
