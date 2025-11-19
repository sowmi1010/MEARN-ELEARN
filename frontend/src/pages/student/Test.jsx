import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

export default function Tests() {
  const [tests, setTests] = useState([]);

  // -------------------------------
  // LOAD TESTS (with search)
  // -------------------------------
  async function loadTests(searchText = "") {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await api.get("/tests", {
        headers,
        params: { search: searchText },
      });

      setTests(res.data || []);
    } catch (err) {
      console.error("Error loading tests:", err);
      setTests([]);
    }
  }

  // -------------------------------
  // INITIAL LOAD + GLOBAL SEARCH LISTENER
  // -------------------------------
  useEffect(() => {
    loadTests(); // initial load (no search)

    const handleSearch = (event) => {
      const text = event.detail || "";
      loadTests(text);
    };

    window.addEventListener("global-search", handleSearch);

    return () => window.removeEventListener("global-search", handleSearch);
  }, []);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  return (
    <div className="min-h-screen p-8 bg-[#0b0f1a] text-gray-100">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-purple-400 tracking-wide">
          Practice Tests
        </h1>
        <p className="text-gray-400 mt-2">
          Assess your concepts with curated tests.
        </p>
      </div>

      {/* LIST – Elegant vertical list */}
      <div className="space-y-6">
        {tests.map((t) => (
          <div
            key={t._id}
            className="
              group
              bg-[#111827]/60 
              backdrop-blur-xl
              border border-purple-800/30 
              hover:border-purple-500/60
              p-6 
              rounded-2xl 
              relative 
              shadow-xl 
              hover:shadow-purple-600/20 
              transition
            "
          >
            {/* Decorative left glow line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b from-purple-600 to-blue-600 opacity-60"></div>

            <div className="flex items-start gap-6">
              {/* THUMBNAIL */}
              <img
                src={`${BASE_URL}/${t.thumbnail}`}
                alt="Test"
                className="
                  w-32 h-32 object-cover rounded-xl 
                  shadow-lg shadow-black/40 
                  group-hover:scale-105 transition
                "
              />

              <div className="flex-1">

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-purple-700/40 rounded-md border border-purple-500/40">
                    {t.category}
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-700/40 rounded-md border border-blue-500/40">
                    {t.subject}
                  </span>
                  <span className="text-xs px-2 py-1 bg-green-700/40 rounded-md border border-green-500/40">
                    {t.standard}
                  </span>
                </div>

                {/* TITLE */}
                <h2 className="text-2xl font-bold text-purple-300 group-hover:text-purple-200 transition">
                  {t.title}
                </h2>

                {/* META */}
                <p className="text-sm text-gray-400 mt-1">
                  Language: {t.language} • Total Questions: {t.questions?.length}
                </p>

                {/* DESCRIPTION */}
                <p className="text-gray-300 mt-3 text-sm line-clamp-2 max-w-2xl">
                  {t.description ||
                    "This test helps evaluate your lesson understanding."}
                </p>

                {/* ACTION BUTTON */}
                <div className="mt-5">
                  <Link
                    to={`/student/tests/view/${t._id}`}
                    className="
                      inline-block 
                      px-5 py-2 
                      rounded-lg 
                      bg-purple-600 
                      hover:bg-purple-700 
                      text-white 
                      transition 
                      shadow-md shadow-purple-900/40
                    "
                  >
                    Start Test →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {tests.length === 0 && (
          <p className="text-gray-400 text-center mt-20">
            No tests available.
          </p>
        )}
      </div>
    </div>
  );
}
