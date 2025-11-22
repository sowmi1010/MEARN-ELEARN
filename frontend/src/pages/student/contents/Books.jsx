import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";

const activeGroup = localStorage.getItem("activeGroup");
const activeStandard = localStorage.getItem("activeStandard");
const activeBoard = localStorage.getItem("activeBoard");
const activeLanguage = localStorage.getItem("activeLanguage");
const activeCourse = localStorage.getItem("activeCourse");

export default function Books() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  const [globalSearch, setGlobalSearch] = useState("");

  /* Listen for global search (broadcast) */
  useEffect(() => {
    const handler = (e) => {
      setGlobalSearch(e.detail);
      fetchBooks(e.detail);
    };

    window.addEventListener("global-search", handler);
    return () => window.removeEventListener("global-search", handler);
  }, []);

  /* Initial load */
  useEffect(() => {
    fetchBooks("");
  }, []);

  async function fetchBooks(searchValue = "") {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await api.get("/books", {
        headers,
        params: {
          group: activeGroup?.toUpperCase(),
          standard: activeStandard,
          board: activeBoard,
          language: activeLanguage,
          search: searchValue,
        },
      });

      setBooks(res.data || []);
    } catch (err) {
      console.error("Failed to load books", err);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-[#0b0f1a] text-gray-100">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Explore Books - {activeCourse}
</h1>

      {/* BOOK GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.length === 0 && (
          <p className="text-gray-400 text-center col-span-3 mt-10">
            No books found.
          </p>
        )}

        {books.map((book) => (
          <div
            key={book._id}
            className="
              group relative rounded-2xl overflow-hidden shadow-lg
              bg-white/5 backdrop-blur-xl border border-white/10 
              hover:border-purple-600/40 hover:shadow-purple-600/20 
              transition-all duration-300
            "
          >
            {/* Thumbnail */}
            <div className="h-56 overflow-hidden">
              <img
                src={`${import.meta.env.VITE_BASE_URL}/${book.thumbnail}`}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="text-xl font-bold text-purple-300">
                {book.title}
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                {book.subject} • Std {book.standard}
              </p>

              {/* View Button */}
              <button
                className="
                  mt-4 w-full py-2 rounded-xl
                  bg-purple-600 hover:bg-purple-700
                  transition text-white font-medium
                "
                onClick={() => navigate(`/student/books/view/${book._id}`)}
              >
                Open Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
