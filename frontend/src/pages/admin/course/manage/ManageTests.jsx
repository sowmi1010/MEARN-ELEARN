import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";

export default function ManageTests() {
  const { groupId, subject, category } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Optional Group Mapping (ObjectId → Name)
  const groupMap = {
    "68e776aaa084762b3d385c1c": "ROOT",
    "68e777aaa084762b3d385c1d": "STEM",
    "68e778aaa084762b3d385c1e": "LEAF",
    "68e779aaa084762b3d385c1f": "FLOWER",
    "68e77aaaa084762b3d385c20": "FRUIT",
    "68e77baaa084762b3d385c21": "SEED",
  };

  // Category Colors
  const categoryColors = {
    lesson: "bg-blue-700",
    "lesson notes": "bg-indigo-700",
    "one word": "bg-teal-700",
    "short answer": "bg-purple-700",
    "medium answer": "bg-orange-700",
    "long answer": "bg-pink-700",
    practical: "bg-red-700",
    important: "bg-green-700",
    "exam paper": "bg-yellow-700 text-black",
    others: "bg-gray-700",
  };

  // Fetch Tests
  useEffect(() => {
    fetchTests();
  }, [groupId, subject, category]);

  const fetchTests = async () => {
    try {
      setLoading(true);

      const groupName = groupMap[groupId] || groupId;

      const normalizedCategory = category
        .trim()
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      const res = await api.get(
        `/tests?group=${groupName}&subject=${subject}&category=${encodeURIComponent(
          normalizedCategory
        )}`
      );

      setTests(res.data || []);
    } catch (err) {
      console.error("Failed to fetch tests:", err);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete Test
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await api.delete(`/tests/${id}`);
      setTests((prev) => prev.filter((t) => t._id !== id));
      alert("Test deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed. Try again.");
    }
  };

  const color = categoryColors[category.toLowerCase()] || "bg-gray-700";

  // Render UI
  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      {/* 🔙 Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold capitalize mb-2">
            {groupMap[groupId] || groupId} → {subject} → {category}
          </h1>
          <p className="text-gray-400">
            Showing all uploaded {category.toLowerCase()} tests for this subject.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-semibold"
        >
          ⬅ Back
        </button>
      </div>

      {/* Test List */}
      {loading ? (
        <p className="text-center text-gray-400">Loading tests...</p>
      ) : tests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <TestCard
              key={test._id}
              test={test}
              color={color}
              onEdit={() => navigate(`/admin/courses/edit/tests/${test._id}`)}
              onView={() => navigate(`/admin/courses/view/test/${test._id}`)}
              onDelete={() => handleDelete(test._id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic">
          No tests found for this subject.
        </p>
      )}
    </div>
  );
}

// Single Test Card Component
function TestCard({ test, color, onEdit, onView, onDelete }) {
  const fileBase = "http://localhost:4000";

  const normalizePath = (p) => (p ? p.replace(/\\/g, "/") : "");

  return (
    <div
      className={`rounded-xl p-4 shadow-md ${color} hover:scale-[1.03] hover:shadow-xl transition-all duration-300`}
    >
      {/* Thumbnail */}
      {test.thumbnail ? (
        <img
          src={`${fileBase}/${normalizePath(test.thumbnail)}`}
          alt={test.title}
          className="rounded-md w-full h-40 object-cover mb-3 border border-gray-800"
        />
      ) : (
        <div className="h-40 bg-gray-700 flex items-center justify-center rounded-md mb-3">
          <span className="text-gray-300 italic">No Thumbnail</span>
        </div>
      )}

      {/* Info */}
      <h3 className="text-lg font-semibold mb-1 truncate">{test.title}</h3>
      {test.language && <p className="text-sm text-gray-300"> {test.language}</p>}
      {test.category && (
        <p className="text-sm text-gray-300 mb-1"> {test.category}</p>
      )}

      {/* File Link */}
      {test.file && (
        <a
          href={`${fileBase}/${normalizePath(test.file)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-3 bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 rounded text-sm font-medium"
        >
          View Test File
        </a>
      )}

      {/*  Admin Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={onEdit}
          className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 text-sm font-semibold"
        >
          Edit
        </button>

        <button
          onClick={onView}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm font-semibold"
        >
          View
        </button>

        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
