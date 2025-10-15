import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaVideo,
  FaBook,
  FaStickyNote,
  FaClipboardList,
  FaQuestionCircle,
  FaBroadcastTower,
  FaLayerGroup,
} from "react-icons/fa";
import axios from "axios";

const groups = [
  {
    name: "ROOT GROUP",
    range: "1st To 4th STANDARD",
    image: "/Root.png",
    id: "root",
  },
  {
    name: "STEM GROUP",
    range: "5th To 8th STANDARD",
    image: "/Stem.png",
    id: "stem",
  },
  {
    name: "LEAF GROUP",
    range: "9th To 12th STANDARD",
    image: "/Leaf.png",
    id: "leaf",
  },
  {
    name: "FLOWER GROUP",
    range: "ENTRANCE EXAM",
    image: "/Flower.png",
    id: "flower",
  },
  {
    name: "FRUIT GROUP",
    range: "GOVERNMENT EXAM",
    image: "/Fruits.png",
    id: "fruit",
  },
  {
    name: "SEED GROUP",
    range: "SKILL DEVELOPMENT",
    image: "/Seed.png",
    id: "seed",
  },
];

export default function CourseHome() {
  const navigate = useNavigate();
  const [totalVideos, setTotalVideos] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch total video count dynamically
  useEffect(() => {
    const fetchVideoCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:4000/api/videos/count/total",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotalVideos(data.total || 0);
      } catch (err) {
        console.error("❌ Error fetching video count:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoCount();
  }, []);

  const handleAddClick = (type) => {
    const routes = {
      video: "/admin/courses/add-video",
      book: "/admin/courses/add-book",
      notes: "/admin/courses/add-notes",
      test: "/admin/courses/add-test",
      quiz: "/admin/courses/add-quiz",
    };
    navigate(routes[type]);
  };

  const buttons = [
    { label: "Video", icon: <FaVideo />, color: "bg-blue-500" },
    { label: "Book", icon: <FaBook />, color: "bg-green-500" },
    { label: "Notes", icon: <FaStickyNote />, color: "bg-yellow-500" },
    { label: "Test", icon: <FaClipboardList />, color: "bg-purple-500" },
    { label: "Quiz", icon: <FaQuestionCircle />, color: "bg-pink-500" },
  ];

  return (
    <div className="p-8 text-white min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-3">
          <FaLayerGroup className="text-blue-400 text-3xl drop-shadow-md" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text tracking-wide">
            Course Management
          </h1>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
          {/* Total Videos */}
          <div className="flex items-center gap-3 bg-gray-800/70 px-5 py-3 rounded-xl border border-gray-700 shadow-lg backdrop-blur-md hover:shadow-blue-700/40 transition-all duration-300">
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">
                Total Videos
              </p>
              <p className="text-2xl font-bold text-blue-400 drop-shadow">
                {loading ? "..." : totalVideos}
              </p>
          </div>

          {/* Add buttons */}
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={() => handleAddClick(btn.label.toLowerCase())}
              className={`${btn.color} hover:brightness-110 flex items-center gap-2 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200`}
            >
              {btn.icon} {btn.label}
            </button>
          ))}

          {/* Live button */}
          <button
            onClick={() => alert("Live feature coming soon!")}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-red-700 transition-all duration-200"
          >
            <FaBroadcastTower /> Live
          </button>
        </div>
      </div>

      {/* Groups Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map((g) => (
          <div
            key={g.id}
            onClick={() => navigate(`/admin/courses/${g.id}/subjects`)}
            className="group cursor-pointer bg-gray-900/80 hover:bg-gray-800 pb-6 rounded-2xl shadow-lg border border-gray-700 transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-700/40 text-center backdrop-blur-md"
          >
            <img
              src={g.image}
              alt={g.name}
              className=" w-full h-80 rounded-t-2xl  object-cover mb-4"
            />
            <h2 className="text-xl font-semibold text-white tracking-wide">
              {g.name}
            </h2>
            <p className="text-sm text-gray-400 font-medium mb-3">
              {g.range}
            </p>
            <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow hover:shadow-blue-500/40">
              View Courses
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
