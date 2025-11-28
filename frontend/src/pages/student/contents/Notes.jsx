import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";
import SubjectTabs from "../components/SubjectTabs";
import { subjectMap } from "../../../utils/courseOptions";

const activeGroup = localStorage.getItem("activeGroup");
const activeStandard = localStorage.getItem("activeStandard");
const activeBoard = localStorage.getItem("activeBoard");
const activeLanguage = localStorage.getItem("activeLanguage");
const activeCourse = localStorage.getItem("activeCourse");
const activeGroupCode = localStorage.getItem("activeGroupCode");

export default function Notes() {
  const navigate = useNavigate();
  const { subject } = useParams(); // ✅ subject from URL

  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState(subject || null);
  const [loading, setLoading] = useState(true);

  const BASE_URL =
    import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  /* ===============================
     GET SUBJECTS BASED ON GROUP
  =============================== */
  const getSubjects = () => {
    const group = activeGroup?.toUpperCase();
    const standard = activeStandard;
    const code = (activeGroupCode || "").toUpperCase();

    if (!group) return [];

    // ✅ ROOT / STEM / FLOWER / FRUIT / SEED
    if (group !== "LEAF") {
      return Array.isArray(subjectMap[group]) ? subjectMap[group] : [];
    }

    // ✅ LEAF - 9TH & 10TH
    if (standard === "9th" || standard === "10th") {
      return subjectMap.LEAF?.[standard] || [];
    }

    // ✅ LEAF - 11TH & 12TH
    if (standard === "11th" || standard === "12th") {
      if (code === "BIO MATHS")
        return subjectMap.LEAF?.[`${standard}-BIO MATHS`] || [];

      if (code === "COMPUTER")
        return subjectMap.LEAF?.[`${standard}-COMPUTER`] || [];

      if (code === "COMMERCE")
        return subjectMap.LEAF?.[`${standard}-COMMERCE`] || [];
    }

    return [];
  };

  /* ===============================
     LOAD NOTES
  =============================== */
  const fetchNotes = async (currentSubject = null, searchText = "") => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await api.get("/notes", {
        headers,
        params: {
          group: activeGroup?.toUpperCase(),
          standard: activeStandard,
          board: activeBoard,
          language: activeLanguage,
          groupCode: activeGroupCode,
          subject: currentSubject,
          search: searchText,
        },
      });

      setNotes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load notes", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     FIRST LOAD
  =============================== */
  useEffect(() => {
    const list = getSubjects();
    setSubjects(list);

    const saved = subject || localStorage.getItem("activeSubject");

    if (saved) {
      setActiveSubject(saved);
      fetchNotes(saved);
    } else {
      fetchNotes();
    }
  }, [subject]);

  /* ===============================
     SEARCH SUPPORT
  =============================== */
  useEffect(() => {
    const handler = (e) => {
      const text = e.detail || "";
      fetchNotes(activeSubject, text);
    };

    window.addEventListener("global-search", handler);
    return () => window.removeEventListener("global-search", handler);
  }, [activeSubject]);

  /* ===============================
     SUBJECT TAB CLICK
  =============================== */
  const handleSubjectChange = (newSubject) => {
    setActiveSubject(newSubject);
    localStorage.setItem("activeSubject", newSubject);
    fetchNotes(newSubject);
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="min-h-screen bg-[#0b0f1a] p-8 text-gray-100">

      {/* ===== HEADER ===== */}
      <h1 className="text-3xl font-bold text-purple-400 mb-2">
        Notes - {activeCourse}
      </h1>

      <p className="text-gray-400 mb-6">
        {activeGroup} • {activeStandard} • {activeBoard} • {activeLanguage}
        {activeSubject && (
          <>
            {"  /  "}
            <span className="text-blue-400 font-semibold">
              {activeSubject}
            </span>
          </>
        )}
      </p>

      {/* ===== SUBJECT TABS ===== */}
      <div className="mb-10">
        <SubjectTabs
          subjects={subjects}
          activeSubject={activeSubject}
          onChange={handleSubjectChange}
        />
      </div>

      {/* ===== NOTES TIMELINE ===== */}
      <div className="mt-6 space-y-6 relative">

        {/* Side Line */}
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-purple-900/40"></div>

        {loading && (
          <div className="text-gray-400 ml-10">
            Loading notes...
          </div>
        )}

        {!loading && notes.length === 0 && (
          <div className="text-gray-400 ml-10">
            No notes found for{" "}
            <span className="text-purple-400 font-semibold">
              {activeSubject || "this course"}
            </span>
          </div>
        )}

        {notes.map((note) => {
          const thumb = note.thumbnail
            ? `${BASE_URL}/${note.thumbnail.replace(/^\/+/, "")}`
            : "/default-thumbnail.png";

          return (
            <div key={note._id} className="ml-10 relative group transition">

              <div className="absolute -left-[34px] top-5 w-4 h-4 rounded-full bg-purple-600 shadow-lg shadow-purple-500/30"></div>

              <div
                className="
                  bg-[#111827] 
                  hover:bg-[#1a2338] 
                  border border-purple-800/20 
                  p-5 
                  rounded-xl 
                  shadow-lg 
                  transition 
                  flex items-start gap-5 
                  cursor-pointer
                "
                onClick={() => navigate(`/student/notes/view/${note._id}`)}
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={thumb}
                    onError={(e) => (e.target.src = "/default-thumbnail.png")}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-purple-300">
                    {note.title}
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    {note.subject} • {note.lesson}
                  </p>

                  <p className="text-gray-300 mt-2 line-clamp-2 text-[15px]">
                    {note.description || "No description available"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
