import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function Books() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    group: "",
    standard: "",
    subject: "",
    search: "",
  });

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await api.get("/books", { headers });
      setBooks(res.data || []);
    } catch (err) {
      console.error("Failed to load books", err);
    }
  }

  return (
    <div className="p-6 text-gray-100">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        Books <span>📘</span>
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <input
          className="bg-[#0f172a] p-3 rounded"
          placeholder="Group"
          onChange={(e) => setFilters({ ...filters, group: e.target.value })}
        />
        <input
          className="bg-[#0f172a] p-3 rounded"
          placeholder="Standard"
          onChange={(e) => setFilters({ ...filters, standard: e.target.value })}
        />
        <input
          className="bg-[#0f172a] p-3 rounded"
          placeholder="Subject"
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
        />
        <input
          className="bg-[#0f172a] p-3 rounded"
          placeholder="Search..."
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Books List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {books.length === 0 && (
          <p className="text-gray-400">No books available</p>
        )}

        {books.map((book) => (
          <div key={book._id} className="bg-[#081024] p-4 rounded-xl shadow-xl">
            <img
              src={`${import.meta.env.VITE_BASE_URL}/${book.thumbnail}`}
              alt="Book Thumbnail"
              className="w-full h-48 object-cover rounded mb-4"
            />

            <h2 className="text-xl font-bold">{book.title}</h2>
            <p className="text-gray-400">{book.subject}</p>
            <p className="text-gray-500">{book.standard}</p>

            <button
              onClick={() => navigate(`/student/books/view/${book._id}`)}
              className="bg-purple-600 hover:bg-purple-700 w-full py-2 rounded mt-4"
            >
              View Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
