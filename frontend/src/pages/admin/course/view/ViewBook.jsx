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

  // Fix any windows / absolute path
  const cleanPath = (path) => {
    if (!path) return "";
    const cleaned = path
      .replace(/\\/g, "/")
      .replace(/^.*uploads\//, "uploads/");
    return cleaned.startsWith("http") ? cleaned : `${BASE}/${cleaned}`;
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
      <div className="min-h-screen flex justify-center items-center bg-[#050813] text-white">
        Loading Book...
      </div>
    );

  if (!book)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#050813] text-red-400">
        Book not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050813] text-white px-6 py-10">
      {/* MAIN CARD */}
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl grid md:grid-cols-3 gap-6">
        {/* LEFT SIDE - BOOK VIEW */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaBookOpen className="text-cyan-400" />
            {book.title}
          </h1>

          {/* PDF VIEWER */}
          {book.file ? (
            <iframe
              src={cleanPath(book.file)}
              title="Book PDF"
              className="w-full h-[520px] rounded-xl border border-cyan-400/20 bg-black shadow-lg"
            />
          ) : (
            <div className="text-gray-400">No book file available</div>
          )}

          {/* ABOUT */}
          <div className="bg-black/60 p-4 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold text-cyan-400 mb-1">
              About Book
            </h3>
            <p className="text-gray-300">
              {book.about || "No description provided"}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - DETAILS */}
        <div className="space-y-5 bg-black/50 p-6 rounded-xl border border-white/10">
          {/* THUMBNAIL */}
          {book.thumbnail && (
            <img
              src={cleanPath(book.thumbnail)}
              alt="Book Thumbnail"
              className="w-full h-44 object-cover rounded-lg border border-white/10 mb-4"
            />
          )}

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

/* ✅ Small info component */
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium">{value || "-"}</p>
  </div>
);
