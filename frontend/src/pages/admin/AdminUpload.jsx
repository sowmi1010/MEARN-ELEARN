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
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
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

  if (loading) {
    return <div className="p-6 text-gray-400">Loading upload form...</div>;
  }

  // ❌ No Access
  if (!(user.role === "admin" || user.permissions?.includes("videos"))) {
    return (
      <div className="p-8 min-h-screen bg-darkBg text-red-400 text-xl font-semibold">
        🚫 You do not have permission to upload videos.
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-darkBg text-gray-200">
      <h1 className="text-4xl font-extrabold text-accent mb-10 tracking-wide">
        📤 Upload New Video
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-darkCard p-8 rounded-2xl shadow-2xl w-full max-w-2xl space-y-6 border border-gray-700"
      >
        {/* Select Course */}
        <div>
          <label className="block mb-2 font-semibold text-gray-300">
            Select Course
          </label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-accent outline-none"
          >
            <option value="">-- Choose a Course --</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Video Title */}
        <div>
          <label className="block mb-2 font-semibold text-gray-300">
            Video Title
          </label>
          <input
            type="text"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-accent outline-none"
          />
        </div>

        {/* Lesson / Chapter */}
        <div>
          <label className="block mb-2 font-semibold text-gray-300">
            Lesson / Chapter
          </label>
          <input
            type="text"
            placeholder="e.g., Lesson 1"
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-accent outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-semibold text-gray-300">
            Description
          </label>
          <textarea
            placeholder="Brief description of the video"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-accent outline-none"
            rows="3"
          ></textarea>
        </div>

        {/* Duration */}
        <div>
          <label className="block mb-2 font-semibold text-gray-300">
            Duration (seconds)
          </label>
          <input
            type="number"
            placeholder="Enter video duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-accent outline-none"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block mb-2 font-semibold text-gray-300">
            Upload File
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-darkBg hover:file:opacity-90"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-400">
              Selected: <span className="text-accent">{file.name}</span>
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-accent to-blue-500 text-darkBg font-bold shadow-lg hover:scale-[1.02] transition-transform"
          >
            Upload Video
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 py-3 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-500 transition"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
