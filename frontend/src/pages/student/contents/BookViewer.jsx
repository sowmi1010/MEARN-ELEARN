import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function BookViewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  /* --------------------------------------------
      LOAD BOOK
  -------------------------------------------- */
  useEffect(() => {
    async function loadBook() {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await api.get(`/books/${id}`, { headers });
        setBook(res.data);
      } catch (err) {
        console.error("Failed to load book:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id]);

  /* --------------------------------------------
      LOADING SHIMMER
  -------------------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">
          Loading book…
        </div>
      </div>
    );
  }

  /* --------------------------------------------
      ERROR FALLBACK
  -------------------------------------------- */
  if (!book) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex flex-col items-center justify-center text-gray-400">
        <p className="text-xl">❌ Book not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-5 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const fileURL = `${BASE_URL}/${book.file?.replace(/^\/+/, "")}`;

  /* --------------------------------------------
      FINAL UI
  -------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080812] to-[#0b0f1a] text-gray-100 p-4 sm:p-6">

      {/* ---------------- HEADER ---------------- */}
      <div
        className="
          sticky top-0 z-30 mb-6
          flex items-center justify-between
          backdrop-blur-xl bg-[#0d0d17]/60
          border border-purple-900/30 
          shadow-xl shadow-black/50
          px-4 py-3 rounded-xl
        "
      >
   

        <h1
          className="
            text-lg sm:text-2xl font-bold 
            text-purple-300 tracking-wide ml-4 flex-1 text-center
          "
        >
          {book.title}
        </h1>

        <div className="w-20 opacity-0">btn</div>
      </div>

      {/* ---------------- VIEWER ---------------- */}
      <div
        className="
          rounded-2xl overflow-hidden
          border border-purple-900/40
          bg-[#0e0e18] 
          shadow-2xl shadow-black/50
        "
      >
        <iframe
          src={fileURL}
          className="
            w-full 
            h-[78vh] sm:h-[85vh] md:h-[88vh]
            bg-black
          "
          title="Book Viewer"
        />
      </div>

      {/* ---------------- DOWNLOAD BUTTON ---------------- */}
      <div className="flex justify-center mt-6">
        <a
          href={fileURL}
          download
          className="
            px-6 py-3
            bg-purple-700 hover:bg-purple-800
            rounded-xl shadow-md shadow-purple-900/40
            text-white font-medium
            transition-all
          "
        >
          ⬇ Download Book
        </a>
      </div>
    </div>
  );
}
