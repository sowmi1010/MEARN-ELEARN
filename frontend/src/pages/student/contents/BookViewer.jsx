import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function BookViewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    async function loadBook() {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await api.get(`/books/${id}`, { headers });
        setBook(res.data);
      } catch (err) {
        console.error("Failed to load book:", err);
      }
    }

    loadBook();
  }, [id]);

  if (!book)
    return <div className="text-gray-300 p-10">Loading book...</div>;

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-gray-100 p-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-purple-400 tracking-wide">
          {book.title}
        </h1>
      </div>

      {/* VIEWER */}
      <div className="rounded-xl overflow-hidden border border-purple-900/40 shadow-2xl">
        <iframe
          src={`${BASE_URL}/${book.file}`}
          className="w-full h-[88vh] rounded-xl bg-black"
          title="Book Viewer"
        />
      </div>
    </div>
  );
}
