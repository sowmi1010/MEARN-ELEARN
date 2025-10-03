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

  useEffect(() => {
    async function fetchCourses() {
      if (!(user.role === "admin" || user.permissions?.includes("videos"))) {
        setLoading(false);
        return;
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

  // Load videos
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

  async function deleteVideo(id) {
    if (!window.confirm("⚠️ Delete this video permanently?")) return;
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

  function startEdit(video) {
    setEditingVideo(video._id);
    setForm({
      title: video.title,
      lesson: video.lesson || "",
      description: video.description || "",
      duration: video.duration || "",
    });
  }

  function cancelEdit() {
    setEditingVideo(null);
    setForm({ title: "", lesson: "", description: "", duration: "" });
  }

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

  if (loading) return <div className="p-6 text-gray-500">Loading videos…</div>;

  if (!(user.role === "admin" || user.permissions?.includes("videos"))) {
    return (
      <div className="p-8 min-h-screen bg-gray-100 dark:bg-darkBg text-red-500 text-xl font-semibold flex items-center justify-center">
        🚫 You do not have permission to manage videos.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBg transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-blue-500 text-darkBg dark:text-white py-10 shadow">
        <h1 className="text-center text-4xl font-extrabold">🎥 Manage Course Videos</h1>
      </div>

      <div className="max-w-5xl mx-auto -mt-10 p-6">
        {/* Course Selector */}
        <div className="mb-8">
          <select
            value={selectedCourse}
            onChange={(e) => loadVideos(e.target.value)}
            className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
             bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-accent outline-none"
          >
            <option value="">-- Select a Course --</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Videos List */}
        {selectedCourse ? (
          videos.length > 0 ? (
            <div className="space-y-5">
              {videos.map((v) => (
                <div
                  key={v._id}
                  className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
                >
                  {editingVideo === v._id ? (
                    <div className="space-y-3">
                      <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                      <Input label="Lesson" value={form.lesson} onChange={(e) => setForm({ ...form, lesson: e.target.value })} />
                      <TextArea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                      <Input label="Duration (seconds)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => saveEdit(v._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                        >
                          <Save size={18} /> Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-400 dark:bg-gray-600 text-white rounded-lg shadow hover:opacity-90 transition"
                        >
                          <X size={18} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Video size={34} className="text-accent" />
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{v.title}</h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {v.lesson || "—"} • {v.duration}s
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => startEdit(v)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => deleteVideo(v._id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No videos available for this course</p>
          )
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">Select a course to manage its videos</p>
        )}
      </div>
    </div>
  );
}

// 🔹 Reusable Components
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input
        {...props}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
        bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-accent outline-none"
      />
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <textarea
        {...props}
        rows={3}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
        bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-accent outline-none"
      ></textarea>
    </div>
  );
}
