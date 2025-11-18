import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

export default function BookViewer() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

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

  if (!book) return <div className="text-white p-6">Loading book...</div>;

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-400 mb-4">{book.title}</h1>

      <iframe
        src={`${BASE_URL}/${book.file}`}
        className="w-full h-[90vh] rounded-xl bg-black"
        title="Book Viewer"
      />
    </div>
  );
}
