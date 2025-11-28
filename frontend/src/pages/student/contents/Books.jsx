import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useNavigate, useParams } from "react-router-dom";

import SubjectTabs from "../components/SubjectTabs";

export default function Books() {
  const navigate = useNavigate();
  const { subject } = useParams();   // ✅ subject from URL

  const [books, setBooks] = useState([]);
  const [activeSubject, setActiveSubject] = useState(subject || null);

  const activeGroup = localStorage.getItem("activeGroup");
  const activeStandard = localStorage.getItem("activeStandard");
  const activeBoard = localStorage.getItem("activeBoard");
  const activeLanguage = localStorage.getItem("activeLanguage");
  const activeCourse = localStorage.getItem("activeCourse");

  /* ✅ LOAD BOOKS */
  const fetchBooks = async (currentSubject) => {
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
          subject: currentSubject, // ✅ subject filtering
        },
      });

      setBooks(res.data || []);
    } catch (err) {
      console.error("Failed to load books:", err);
    }
  };

  /* ✅ FIRST LOAD */
  useEffect(() => {
    const saved = subject || localStorage.getItem("activeSubject");
    setActiveSubject(saved || null);

    fetchBooks(saved);
  }, [subject]);

  /* ✅ WHEN SUBJECT TAB CLICKS */
  const handleSubjectChange = (newSubject) => {
    setActiveSubject(newSubject);
    fetchBooks(newSubject);
  };

  return (
    <div className="min-h-screen p-6 bg-[#0b0f1a] text-gray-100">

      {/* ================= HEADER ================= */}
      <p className="mb-6 text-sm text-gray-400">
        Showing Books for:
        <span className="text-purple-400 font-bold ml-2">
          {activeCourse}
        </span>
        {activeSubject && (
          <>
            {"  /  "}
            <span className="text-blue-400">
              {activeSubject}
            </span>
          </>
        )}
      </p>

      {/* ✅ SUBJECT TABS */}
      <SubjectTabs onChange={handleSubjectChange} />

      {/* ================= BOOK GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {books.length === 0 && (
          <p className="text-gray-400 text-center col-span-3 mt-10">
            No books found for{" "}
            <span className="text-purple-400 font-semibold">
              {activeSubject || "this course"}
            </span>
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
            {/* THUMBNAIL */}
            <div className="h-56 overflow-hidden">
              <img
                src={`${import.meta.env.VITE_BASE_URL}/${book.thumbnail}`}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h2 className="text-xl font-bold text-purple-300">
                {book.title}
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                {book.subject} • Std {book.standard}
              </p>

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
