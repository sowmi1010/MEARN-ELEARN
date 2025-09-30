import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Edit, Trash2, Video, Save, X } from "lucide-react";

export default function AdminVideos() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [form, setForm] = useState({ title: "", lesson: "", description: "", duration: "" });
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ Load courses only if user has permission
  useEffect(() => {
    async function fetchCourses() {
      if (!(user.role === "admin" || user.permissions?.includes("videos"))) {
        setLoading(false);
        return; // ❌ no access
      }

      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
      } catch (err) {
        console.error("❌ Fetch courses error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [user.role, user.permissions]);

  // Load videos when course selected
  async function loadVideos(courseId) {
    setSelectedCourse(courseId);
    if (!courseId) return setVideos([]);

    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(res.data.videos || []);
    } catch (err) {
      console.error("❌ Fetch videos error:", err.response?.data || err.message);
    }
  }

  // Delete video
  async function deleteVideo(id) {
    if (!window.confirm("Delete this video permanently?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadVideos(selectedCourse);
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
    }
  }

  // Start editing
  function startEdit(video) {
    setEditingVideo(video._id);
    setForm({
      title: video.title,
      lesson: video.lesson || "",
      description: video.description || "",
      duration: video.duration || "",
    });
  }

  // Cancel editing
  function cancelEdit() {
    setEditingVideo(null);
    setForm({ title: "", lesson: "", description: "", duration: "" });
  }

  // Save edit
  async function saveEdit(id) {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/videos/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cancelEdit();
      loadVideos(selectedCourse);
    } catch (err) {
      console.error("❌ Save error:", err.response?.data || err.message);
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-400">Loading videos...</div>;
  }

  // ❌ No Access
  if (!(user.role === "admin" || user.permissions?.includes("videos"))) {
    return (
      <div className="p-8 min-h-screen bg-darkBg text-red-400 text-xl font-semibold">
        🚫 You do not have permission to manage videos.
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-darkBg text-gray-200">
      <h1 className="text-3xl font-extrabold text-accent mb-6">🎥 Manage Videos</h1>

      {/* Select Course Dropdown */}
      <div className="mb-6">
        <select
          value={selectedCourse}
          onChange={(e) => loadVideos(e.target.value)}
          className="p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-accent outline-none"
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Video List */}
      {selectedCourse ? (
        <div className="space-y-4">
          {videos.length > 0 ? (
            videos.map((v) => (
              <div
                key={v._id}
                className="bg-darkCard p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-accent/30 transition"
              >
                {editingVideo === v._id ? (
                  // Edit Form
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Lesson"
                      value={form.lesson}
                      onChange={(e) => setForm({ ...form, lesson: e.target.value })}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                    <textarea
                      placeholder="Description"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                    <input
                      type="number"
                      placeholder="Duration (seconds)"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => saveEdit(v._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        <Save size={18} /> Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        <X size={18} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal View
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Video size={32} className="text-accent" />
                      <div>
                        <h2 className="text-lg font-bold">{v.title}</h2>
                        <p className="text-sm text-gray-400">
                          {v.lesson} • {v.duration}s
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(v)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => deleteVideo(v._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No videos available for this course</p>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Please select a course to manage videos</p>
      )}
    </div>
  );
}
