import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

export default function Tests() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    loadTests();
  }, []);

  async function loadTests() {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get("/tests", { headers });
      setTests(res.data || []);
    } catch (err) {
      console.error("Error loading tests:", err);
    }
  }

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  return (
    <div className="p-6 text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Tests</h1>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {tests.map((t) => (
          <div
            key={t._id}
            className="bg-[#0f172a] rounded-xl p-4 shadow hover:scale-[1.02] transition"
          >
            <img
              src={`${BASE_URL}/${t.thumbnail}`}
              className="w-full h-40 object-cover rounded-lg mb-4"
              alt="Test Thumbnail"
            />

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-green-600 px-2 py-1 rounded">
                {t.category}
              </span>
              <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                {t.subject}
              </span>
            </div>

            <h2 className="text-lg font-bold">{t.title}</h2>
            <p className="text-sm text-gray-400">
              {t.standard} • {t.language}
            </p>

            <Link
              to={`/student/tests/view/${t._id}`}
              className="block bg-purple-600 mt-4 text-center py-2 rounded hover:bg-purple-700"
            >
              View Test
            </Link>
          </div>
        ))}
      </div>

      {tests.length === 0 && (
        <p className="text-gray-400 text-center mt-10">No tests available</p>
      )}
    </div>
  );
}
