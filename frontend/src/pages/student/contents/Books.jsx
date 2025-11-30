// src/pages/student/Books.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";

import SubjectTabs from "../components/SubjectTabs";
import Pagination from "../../../components/common/Pagination";

export default function Books() {
  const navigate = useNavigate();
  const { subject } = useParams();

  const [books, setBooks] = useState([]);
  const [activeSubject, setActiveSubject] = useState(subject || "");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  /* ------------------------------
      ACTIVE STUDENT INFO
  ------------------------------ */
  const activeGroup = localStorage.getItem("activeGroup");
  const activeStandard = localStorage.getItem("activeStandard");
  const activeBoard = localStorage.getItem("activeBoard");
  const activeLanguage = localStorage.getItem("activeLanguage");
  const activeCourse = localStorage.getItem("activeCourse");

  const BASE_URL =
    import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  /* ------------------------------
      LOAD BOOKS
  ------------------------------ */
  const loadBooks = async () => {
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
          subject: activeSubject || undefined,
          search: searchQuery || undefined,
        },
      });

      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load books:", err);
      setBooks([]);
    }
  };

  /* ------------------------------
      FIRST LOAD
  ------------------------------ */
  useEffect(() => {
    const saved = subject || localStorage.getItem("activeSubject");
    if (saved) setActiveSubject(saved);

    loadBooks();
  }, [subject, activeSubject]);

  /* ------------------------------
      GLOBAL SEARCH
  ------------------------------ */
  useEffect(() => {
    const handler = (e) => {
      const text = (e.detail || "").toString().trim();
      setSearchQuery(text);
      setCurrentPage(1);
    };

    window.addEventListener("global-search", handler);
    return () => window.removeEventListener("global-search", handler);
  }, []);

  /* ------------------------------
      SUBJECT CHANGE (Tabs)
  ------------------------------ */
  const handleSubjectChange = (sub) => {
    setActiveSubject(sub);
    localStorage.setItem("activeSubject", sub);
    setSearchQuery("");
    setCurrentPage(1);
  };

  /* ------------------------------
      FILTERED LIST
  ------------------------------ */
  const filteredBooks = useMemo(() => {
    let list = [...books];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.subject?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [books, searchQuery]);

  /* ------------------------------
      PAGINATION
  ------------------------------ */
  const totalPages = Math.ceil(filteredBooks.length / perPage);

  const paginated = filteredBooks.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  /* ------------------------------
      UI
  ------------------------------ */
  return (
    <div className="min-h-screen bg-[#0b0f1a] p-8 text-gray-100">

      {/* HEADER */}
      <p className="text-gray-400 text-sm mb-5">
        Books for:  
        <span className="ml-2 text-purple-400 font-semibold">
          {activeCourse}
        </span>

        {activeSubject && (
          <>
            {" / "}
            <span className="text-blue-400">{activeSubject}</span>
          </>
        )}
      </p>

      {/* SUBJECT TABS */}
      <SubjectTabs
        activeSubject={activeSubject}
        onChange={handleSubjectChange}
      />

      {/* EMPTY */}
      {!paginated.length && (
        <p className="text-gray-400 text-center mt-14 text-lg">
          No books found for{" "}
          <span className="text-purple-400 font-semibold">
            {activeSubject || "this course"}
          </span>
        </p>
      )}

      {/* GRID */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {paginated.map((book) => {
          const img = book.thumbnail
            ? `${BASE_URL}/${book.thumbnail.replace(/^\/+/, "")}`
            : "/no-thumb.png";

          return (
            <div
              key={book._id}
              className="
                group rounded-2xl overflow-hidden shadow-lg
                bg-[#101520]/80 backdrop-blur-xl
                border border-purple-800/20 
                hover:border-purple-600/50 
                hover:shadow-purple-600/30 
                transition-all duration-300
              "
            >
              {/* Thumbnail */}
              <div className="h-56 overflow-hidden">
                <img
                  src={img}
                  onError={(e) => (e.target.src = "/no-thumb.png")}
                  className="w-full h-full object-cover 
                    group-hover:scale-110 transition duration-500"
                />
              </div>

              {/* Body */}
              <div className="p-5">
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
                  Open Book →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
