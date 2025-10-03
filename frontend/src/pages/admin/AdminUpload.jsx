import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function AdminUpload() {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [lesson, setLesson] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [file, setFile] = useState(null);
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

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("courseId", course);
      formData.append("title", title);
      formData.append("lesson", lesson);
      formData.append("description", description);
      formData.append("duration", duration);
      formData.append("file", file);

      const token = localStorage.getItem("token");
      await api.post("/videos/upload", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      alert("✅ Video uploaded successfully!");
      resetForm();
    } catch (err) {
      console.error("❌ Upload error:", err.response?.data || err.message);
      alert("❌ Upload failed: " + (err.response?.data?.message || err.message));
    }
  }

  function resetForm() {
    setCourse("");
    setTitle("");
    setLesson("");
    setDescription("");
    setDuration("");
    setFile(null);
  }

  if (loading) return <div className="p-6 text-gray-500">Loading upload form…</div>;

  if (!(user.role === "admin" || user.permissions?.includes("videos"))) {
    return (
      <div className="p-8 min-h-screen bg-gray-100 dark:bg-darkBg text-red-500 text-xl font-semibold flex items-center justify-center">
        🚫 You do not have permission to upload videos.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBg transition-colors duration-300">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-accent to-blue-500 text-darkBg dark:text-white py-10 shadow-md">
        <h1 className="text-center text-4xl font-extrabold drop-shadow">
          📤 Upload New Video
        </h1>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto -mt-10 p-8 bg-white dark:bg-darkCard rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
              Select Course
            </label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-accent outline-none"
            >
              <option value="">-- Choose a Course --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Video Title */}
          <InputField label="Video Title" value={title} setValue={setTitle} placeholder="Enter video title" required />

          {/* Lesson */}
          <InputField label="Lesson / Chapter" value={lesson} setValue={setLesson} placeholder="e.g., Lesson 1" />

          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of the video"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-accent outline-none"
            ></textarea>
          </div>

          {/* Duration */}
          <InputField label="Duration (seconds)" value={duration} setValue={setDuration} placeholder="Enter duration" type="number" />

          {/* File Upload */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Upload File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="block w-full text-sm text-gray-700 dark:text-gray-300 
              file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
              file:font-semibold file:bg-accent file:text-darkBg hover:file:opacity-90"
            />
            {file && (
              <p className="mt-2 text-sm text-accent font-medium">Selected: {file.name}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-accent to-blue-500 text-darkBg font-bold shadow-lg hover:scale-[1.03] transition-transform"
            >
              Upload Video
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-3 rounded-lg bg-gray-400 dark:bg-gray-600 text-white font-semibold hover:opacity-90 transition"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 🔹 Reusable InputField
function InputField({ label, value, setValue, placeholder, type = "text", required = false }) {
  return (
    <div>
      <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
        bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-accent outline-none"
      />
    </div>
  );
}
