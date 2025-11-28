import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./../../../utils/api";
import Dropdown from "../../../components/common/Dropdown";
import {
  standardOptions,
  boardOptions,
  languageOptions,
  subjectMap,
} from "../../../utils/courseOptions";

import {
  FaVideo,
  FaBook,
  FaStickyNote,
  FaClipboardList,
  FaQuestionCircle,
  FaTrash,
  FaEye,
  FaEdit,
  FaPlus,
} from "react-icons/fa";

const categories = [
  "Lesson",
  "One Word",
  "Short Answer",
  "Medium Answer",
  "Long Answer",
  "Practical",
  "Important",
  "Exam Paper",
  "Others",
];

const tabs = [
  { key: "videos", label: "Videos", icon: <FaVideo /> },
  { key: "books", label: "Books", icon: <FaBook /> },
  { key: "notes", label: "Notes", icon: <FaStickyNote /> },
  { key: "tests", label: "Tests", icon: <FaClipboardList /> },
  { key: "quiz", label: "Quiz", icon: <FaQuestionCircle /> },
];

export default function ContentManager() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const groupName = groupId?.toUpperCase();
  const [activeTab, setActiveTab] = useState("videos");

  const [filters, setFilters] = useState({
    standard: "",
    board: "",
    language: "",
    subject: "",
    category: "",
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileBase = "http://localhost:4000";

  /* ======================================================
     SMART SUBJECT RESOLVER (FIXED)
  ====================================================== */
  const getSubjects = () => {
    if (!groupName) return [];

    // ✅ ROOT / STEM / FLOWER / FRUIT / SEED
    if (groupName !== "LEAF") {
      return Array.isArray(subjectMap[groupName])
        ? subjectMap[groupName]
        : [];
    }

    const { standard } = filters;
    if (!standard) return [];

    // ✅ 9th & 10th
    if (standard === "9th" || standard === "10th") {
      return subjectMap.LEAF[standard] || [];
    }

    // ✅ 11th / 12th – detect by groupCode in loaded items
    const detectedCodes = items.map(
      (i) => (i.groupCode || "").toUpperCase()
    );

    if (detectedCodes.some((g) => g === "BIO MATHS")) {
      return subjectMap.LEAF[`${standard}-BIO MATHS`] || [];
    }

    if (detectedCodes.some((g) => g === "COMPUTER")) {
      return subjectMap.LEAF[`${standard}-COMPUTER`] || [];
    }

    if (detectedCodes.some((g) => g === "COMMERCE")) {
      return subjectMap.LEAF[`${standard}-COMMERCE`] || [];
    }

    return [];
  };

  /* ======================================================
     HELPERS
  ====================================================== */

  const getEndpoint = () => {
    if (activeTab === "videos") return "/videos";
    if (activeTab === "books") return "/books";
    if (activeTab === "notes") return "/notes";
    if (activeTab === "tests") return "/tests";
    if (activeTab === "quiz") return "/quizzes";
  };

  const getThumbnailUrl = (item) => {
    if (!item?.thumbnail) return "/default-thumb.png";
    return `${fileBase}/${item.thumbnail.replace(/\\/g, "/")}`;
  };

  const getTypeBadgeColor = () => {
    if (activeTab === "videos") return "bg-blue-500/20 text-blue-300";
    if (activeTab === "books") return "bg-emerald-500/20 text-emerald-300";
    if (activeTab === "notes") return "bg-yellow-500/20 text-yellow-300";
    if (activeTab === "tests") return "bg-purple-500/20 text-purple-300";
    if (activeTab === "quiz") return "bg-pink-500/20 text-pink-300";
    return "bg-gray-600/20 text-gray-300";
  };

  const getTypeLabel = () =>
    activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

  const handleAdd = () => {
    const routes = {
      videos: "/admin/courses/add-video",
      books: "/admin/courses/add-book",
      notes: "/admin/courses/add-notes",
      tests: "/admin/courses/add-test",
      quiz: "/admin/courses/add-quiz",
    };
    navigate(routes[activeTab]);
  };

  const getViewRoute = (id) =>
    `/admin/courses/view/${activeTab.slice(0, -1)}/${id}`;
  const getEditRoute = (id) => `/admin/courses/${activeTab}/edit/${id}`;

  /* ======================================================
     FETCH DATA
  ====================================================== */
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delay);
  }, [filters, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get(getEndpoint(), {
        params: {
          group: groupName,
          ...filters,
        },
      });

      setItems(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     HANDLERS
  ====================================================== */

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await api.delete(`${getEndpoint()}/${id}`);
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="p-8 bg-[#040711] text-white min-h-screen">

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-blue-400 tracking-wide">
              {groupName} - Content Manager
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTypeBadgeColor()}`}
            >
              {getTypeLabel()}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Manage all {activeTab.toUpperCase()} for this group
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-purple-500 px-5 py-2 rounded-xl font-semibold shadow-lg"
        >
          <FaPlus />
          Add {activeTab.slice(0, -1)}
        </button>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3 mb-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all text-sm
              ${
                isActive
                  ? "bg-blue-600/90 border-blue-400 text-white"
                  : "bg-[#020617] border-gray-700 text-gray-300 hover:bg-[#111827]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* FILTERS */}
      <div className="bg-[#020617]/80 p-6 rounded-2xl border border-gray-800 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Dropdown
            label="Standard"
            name="standard"
            value={filters.standard}
            options={standardOptions[groupName] || []}
            onChange={handleChange}
          />

          <Dropdown
            label="Board"
            name="board"
            value={filters.board}
            options={boardOptions}
            onChange={handleChange}
          />

          <Dropdown
            label="Language"
            name="language"
            value={filters.language}
            options={languageOptions}
            onChange={handleChange}
          />

          <Dropdown
            label="Subject"
            name="subject"
            value={filters.subject}
            options={getSubjects()}
            onChange={handleChange}
          />

          <Dropdown
            label="Category"
            name="category"
            value={filters.category}
            options={categories}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-center text-blue-400 mt-10">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No {activeTab} found for this filter.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#020617]">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-black/40 text-gray-300">
                <th className="p-4">#</th>
                <th className="p-4 text-left">Content</th>
                <th className="p-4">Standard</th>
                <th className="p-4">Board</th>
                <th className="p-4">Language</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item._id}
                  className="border-t border-gray-800 hover:bg-[#0b1120]"
                >
                  <td className="p-4 text-gray-400">{idx + 1}</td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getThumbnailUrl(item)}
                        className="w-14 h-14 object-cover rounded border"
                        onError={(e) =>
                          (e.target.src = "/default-thumb.png")
                        }
                      />
                      <div>
                        <p className="font-semibold">
                          {item.title || item.question}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">{item.standard}</td>
                  <td className="p-4">{item.board}</td>
                  <td className="p-4">{item.language}</td>
                  <td className="p-4">{item.subject}</td>
                  <td className="p-4">{item.category}</td>

                  <td className="p-4 flex justify-center gap-3">
                    <FaEye
                      className="cursor-pointer text-blue-400"
                      onClick={() => navigate(getViewRoute(item._id))}
                    />
                    <FaEdit
                      className="cursor-pointer text-yellow-400"
                      onClick={() => navigate(getEditRoute(item._id))}
                    />
                    <FaTrash
                      className="cursor-pointer text-red-400"
                      onClick={() => handleDelete(item._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
