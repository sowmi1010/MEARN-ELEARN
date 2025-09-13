import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function AdminVideos() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null); // ✅ current video being edited
  const [form, setForm] = useState({ title: "", lesson: "", description: "", duration: "" });

  // ✅ Load courses
  useEffect(() => {
    async function fetchCourses() {
      const token = localStorage.getItem("token");
      const res = await api.get("/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    }
    fetchCourses();
  }, []);

  // ✅ Load videos when course selected
  async function loadVideos(courseId) {
    setSelectedCourse(courseId);
    const token = localStorage.getItem("token");
    const res = await api.get(`/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setVideos(res.data.videos);
  }

  // ✅ Delete video
  async function deleteVideo(id) {
    if (!window.confirm("Delete this video?")) return;
    const token = localStorage.getItem("token");
    await api.delete(`/videos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadVideos(selectedCourse); // refresh
  }

  // ✅ Start editing
  function startEdit(video) {
    setEditingVideo(video._id);
    setForm({
      title: video.title,
      lesson: video.lesson || "",
      description: video.description || "",
      duration: video.duration || "",
    });
  }

  // ✅ Cancel editing
  function cancelEdit() {
    setEditingVideo(null);
    setForm({ title: "", lesson: "", description: "", duration: "" });
  }

  // ✅ Save edit
  async function saveEdit(id) {
    const token = localStorage.getItem("token");
    await api.put(`/videos/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    cancelEdit();
    loadVideos(selectedCourse); // refresh
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-accent mb-4">Manage Videos</h1>

      {/* Select Course */}
      <select
        value={selectedCourse}
        onChange={(e) => loadVideos(e.target.value)}
        className="mb-4 p-2 bg-gray-800 text-white rounded"
      >
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.title}
          </option>
        ))}
      </select>

      {/* Video List */}
      <div className="space-y-3">
        {videos.map((v) => (
          <div
            key={v._id}
            className="bg-darkCard p-4 rounded"
          >
            {editingVideo === v._id ? (
              // ✅ Edit Form
              <div className="space-y-2">
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
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(v._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // ✅ Normal View
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{v.title}</h2>
                  <p className="text-sm text-gray-400">{v.lesson}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(v)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteVideo(v._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
