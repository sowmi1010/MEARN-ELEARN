import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";
import { FaBookOpen, FaArrowLeft } from "react-icons/fa";

export default function ViewBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE = "http://localhost:4000";

  // Clean uploaded file path from Windows or absolute paths
  const cleanPath = (path) => {
    if (!path) return "";
    const fixed = path.replace(/\\/g, "/").replace(/^.*uploads\//, "uploads/");
    return fixed.startsWith("http") ? fixed : `${BASE}/${fixed}`;
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error("Failed to fetch book:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#020617] text-cyan-400 text-xl">
        Loading book...
      </div>
    );

  if (!book)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#020617] text-red-400 text-xl">
        Book not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a1124] to-[#1e293b] text-white px-6 py-10">
      {/* MAIN CARD */}
      <div
        className="
        max-w-8xl mx-auto 
        bg-white/5 rounded-3xl 
        shadow-2xl shadow-cyan-900/20 
        border border-white/10 
        backdrop-blur-lg 
        grid md:grid-cols-3 gap-10 
        p-10
      "
      >
        {/* LEFT SIDE — PDF VIEWER & TITLE */}
        <div className="md:col-span-2 space-y-8">
          {/* TITLE */}
          <h1 className="text-4xl font-bold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
            <FaBookOpen className="text-cyan-300 drop-shadow" />
            {book.title}
          </h1>

          {/* PDF VIEWER */}
          {book.file ? (
            <iframe
              src={cleanPath(book.file)}
              className="w-full h-[550px] rounded-2xl 
                         border border-cyan-400/30 shadow-xl bg-black/40"
            />
          ) : (
            <p className="text-gray-400">No file available</p>
          )}

          {/* ABOUT SECTION */}
          <div className="bg-black/40 p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-cyan-300 mb-2">
              About This Book
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {book.about || "No description provided."}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE — INFORMATION PANEL */}
        <div className="bg-black/40 p-6 rounded-2xl border border-white/10 shadow-xl space-y-6">
          {/* THUMBNAIL */}
          {book.thumbnail && (
            <img
              src={cleanPath(book.thumbnail)}
              alt="Book Thumbnail"
              className="w-full h-48 object-cover rounded-xl border border-cyan-400/20 shadow-lg"
            />
          )}

          {/* DETAILS */}
          <Info label="Group" value={book.group} />
          <Info label="Standard" value={book.standard} />
          <Info label="Board" value={book.board} />
          <Info label="Language" value={book.language} />
          <Info label="Subject" value={book.subject} />
          <Info label="Category" value={book.category || "-"} />
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
