import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";

export default function ManageVideos() {
  const { groupId, subject, category } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Optional group mapping (IDs → names)
  const groupMap = {
    "68e776aaa084762b3d385c1c": "ROOT",
    "68e777aaa084762b3d385c1d": "STEM",
    "68e778aaa084762b3d385c1e": "LEAF",
    "68e779aaa084762b3d385c1f": "FLOWER",
    "68e77aaaa084762b3d385c20": "FRUIT",
    "68e77baaa084762b3d385c21": "SEED",
  };

  // Category Configs
  const categoryConfig = {
    videos: { title: "🎥 All Videos", color: "bg-blue-700" },
    lesson: { title: "📘 Lessons", color: "bg-blue-700" },
    "one word": { title: "📝 One Word", color: "bg-green-700" },
    "short answer": { title: "💡 Short Answer", color: "bg-purple-700" },
    "medium answer": { title: "🧩 Medium Answer", color: "bg-yellow-700" },
    "long answer": { title: "📖 Long Answer", color: "bg-orange-700" },
    practical: { title: "🔬 Practical", color: "bg-pink-700" },
    important: { title: "⭐ Important", color: "bg-teal-700" },
    "exam paper": { title: "📄 Exam Paper", color: "bg-red-700" },
    others: { title: "🗂️ Others", color: "bg-gray-700" },
  };

  const catKey = category.toLowerCase();
  const currentConfig = categoryConfig[catKey] || {
    title: category,
    color: "bg-gray-700",
  };

  useEffect(() => {
    fetchVideos();
  }, [groupId, subject, category]);

  // Fetch Videos
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const groupName = groupMap[groupId] || groupId;

      const normalizedCategory =
        category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

      const res = await api.get(
        `/videos?group=${groupName}&subject=${subject}&category=${normalizedCategory}`
      );
      setVideos(res.data || []);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete Video
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await api.delete(`/videos/${id}`);
      setVideos(videos.filter((v) => v._id !== id));
      alert("Video deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed. Try again.");
    }
  };

  const fileBase = "http://localhost:4000";

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold capitalize mb-2">
          {groupMap[groupId] || groupId} → {subject} → {category}
        </h1>
        <p className="text-gray-400">
          Showing all uploaded videos for this subject.
        </p>
      </div>

      {/* Video List */}
      {loading ? (
        <p className="text-center text-gray-400">Loading videos...</p>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className={`rounded-xl p-4 shadow-md ${currentConfig.color} hover:scale-[1.03] hover:shadow-xl transition-all duration-300`}
            >
              {/* Thumbnail */}
              {video.thumbnail ? (
                <img
                  src={`${fileBase}/${video.thumbnail.replace(/\\/g, "/")}`}
                  alt={video.title}
                  className="rounded-md w-full h-40 object-cover mb-3 border border-gray-800"
                />
              ) : (
                <div className="h-40 bg-gray-700 flex items-center justify-center rounded-md mb-3">
                  <span className="text-gray-300 italic">No Thumbnail</span>
                </div>
              )}

              {/* Title & Meta */}
              <h3 className="text-lg font-semibold mb-1 truncate">
                {video.title}
              </h3>
              {video.language && (
                <p className="text-sm text-gray-300">🌐 {video.language}</p>
              )}
              {video.category && (
                <p className="text-sm text-gray-300 mb-1">
                  {video.category}
                </p>
              )}
              {video.aboutCourse && (
                <p className="text-sm text-gray-200 mt-2 line-clamp-2">
                  {video.aboutCourse}
                </p>
              )}

              {/* Watch Video */}
              {video.file && (
                <a
                  href={`${fileBase}/${video.file.replace(/\\/g, "/")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 rounded text-sm font-medium"
                >
                  Watch Video
                </a>
              )}

              {/* Admin Controls */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/admin/courses/edit/video/${video._id}`)}
                  className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 text-sm font-semibold"
                >
                 Edit
                </button>

                <button
                  onClick={() => navigate(`/admin/courses/view/video/${video._id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm font-semibold"
                >
                  View
                </button>

                <button
                  onClick={() => handleDelete(video._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic">
          No videos found for this subject.
        </p>
      )}
    </div>
  );
}
