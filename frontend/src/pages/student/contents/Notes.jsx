// src/pages/student/Notes.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";
import SubjectTabs from "../components/SubjectTabs";
import Pagination from "../../../components/common/Pagination";
import { subjectMap } from "../../../utils/courseOptions";

/* --------------------------------------------
   ACTIVE USER INFO
-------------------------------------------- */
const activeGroup = localStorage.getItem("activeGroup");
const activeStandard = localStorage.getItem("activeStandard");
const activeBoard = localStorage.getItem("activeBoard");
const activeLanguage = localStorage.getItem("activeLanguage");
const activeCourse = localStorage.getItem("activeCourse");
const activeGroupCode = localStorage.getItem("activeGroupCode");

export default function Notes() {
  const navigate = useNavigate();
  const { subject } = useParams();

  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState(subject || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const BASE_URL =
    import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  /* --------------------------------------------
     SUBJECT LIST
  -------------------------------------------- */
  const getSubjects = () => {
    const group = activeGroup?.toUpperCase();
    const standard = activeStandard;
    const code = (activeGroupCode || "").toUpperCase();

    if (!group) return [];

    if (group !== "LEAF") return subjectMap[group] || [];

    if (standard === "9th" || standard === "10th")
      return subjectMap.LEAF?.[standard] || [];

    if (standard === "11th" || standard === "12th")
      return subjectMap.LEAF?.[`${standard}-${code}`] || [];

    return [];
  };

  /* --------------------------------------------
     LOAD NOTES
  -------------------------------------------- */
  const loadNotes = async () => {
    try {
      setLoading(true);

      const headers = localStorage.getItem("token")
        ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
        : {};

      const res = await api.get("/notes", {
        headers,
        params: {
          group: activeGroup?.toUpperCase(),
          standard: activeStandard,
          board: activeBoard,
          language: activeLanguage,
          groupCode: activeGroupCode,
          subject: activeSubject || undefined,
          search: searchQuery || undefined,
        },
      });

      setNotes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load notes:", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------
     FIRST LOAD
  -------------------------------------------- */
  useEffect(() => {
    setSubjects(getSubjects());

    const saved = subject || localStorage.getItem("activeSubject");
    if (saved) setActiveSubject(saved);

    loadNotes();
  }, [subject, activeSubject]);

  /* --------------------------------------------
     GLOBAL SEARCH HANDLER
  -------------------------------------------- */
  useEffect(() => {
    const handler = (e) => {
      const text = (e.detail || "").toString().trim();
      setSearchQuery(text);
      setCurrentPage(1);
    };

    window.addEventListener("global-search", handler);
    return () => window.removeEventListener("global-search", handler);
  }, []);

  /* --------------------------------------------
     SUBJECT CHANGE
  -------------------------------------------- */
  const handleSubjectChange = (sub) => {
    setActiveSubject(sub);
    setSearchQuery("");
    setCurrentPage(1);
    localStorage.setItem("activeSubject", sub);
  };

  /* --------------------------------------------
     FILTERED NOTES
  -------------------------------------------- */
  const filteredNotes = useMemo(() => {
    let list = [...notes];

    if (searchQuery) {
      const text = searchQuery.toLowerCase();
      list = list.filter(
        (n) =>
          n.title?.toLowerCase().includes(text) ||
          n.subject?.toLowerCase().includes(text) ||
          n.lesson?.toLowerCase().includes(text)
      );
    }

    return list;
  }, [notes, searchQuery]);

  /* --------------------------------------------
     PAGINATION
  -------------------------------------------- */
  const totalPages = Math.ceil(filteredNotes.length / perPage);
  const paginated = filteredNotes.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  /* --------------------------------------------
     UI
  -------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-gray-100 p-6 md:p-10">

      {/* HEADER */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-purple-400 mb-2">
        Notes – {activeCourse}
      </h1>

      <p className="text-gray-400 mb-6">
        {activeGroup} • {activeStandard} • {activeBoard} • {activeLanguage}
        {activeSubject && (
          <span className="ml-2 text-blue-400 font-semibold">
            / {activeSubject}
          </span>
        )}
      </p>

      {/* SUBJECT TABS */}
      <SubjectTabs
        subjects={subjects}
        activeSubject={activeSubject}
        onChange={handleSubjectChange}
      />

      {/* LOADING */}
      {loading && (
        <p className="text-gray-400 mt-10 text-center">Loading notes...</p>
      )}

      {/* EMPTY */}
      {!loading && filteredNotes.length === 0 && (
        <p className="text-gray-400 mt-10 text-center">
          No notes found for{" "}
          <span className="text-purple-400">{activeSubject}</span>
        </p>
      )}

      {/* NOTES TIMELINE */}
      <div className="relative mt-10 space-y-8">

        {/* Vertical Line */}
        <div className="absolute left-5 md:left-10 top-0 bottom-0 w-[2px] bg-purple-900/40"></div>

        {paginated.map((note) => {
          const imageUrl = note.thumbnail
            ? `${BASE_URL}/${note.thumbnail.replace(/^\/+/, "")}`
            : "/default-thumbnail.png";

          return (
            <div
              key={note._id}
              onClick={() => navigate(`/student/notes/view/${note._id}`)}
              className="relative ml-12 md:ml-20 cursor-pointer group"
            >
              {/* Dot */}
              <div className="absolute -left-7 md:-left-12 top-5 w-4 h-4 rounded-full bg-purple-600 shadow-lg shadow-purple-500/40"></div>

              {/* Card */}
              <div className="
                bg-[#111827]/80 
                hover:bg-[#1a2338] 
                border border-purple-800/30 
                rounded-xl 
                p-5 
                shadow-lg 
                flex 
                gap-5 
                transition 
                hover:border-purple-500/50
              ">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                  <img
                    src={imageUrl}
                    onError={(e) => (e.target.src = "/default-thumbnail.png")}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-purple-300">
                    {note.title}
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    {note.subject} • {note.lesson}
                  </p>

                  <p className="text-gray-300 mt-2 line-clamp-2 text-sm">
                    {note.description || "No description available."}
                  </p>
                </div>
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
