import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function AdminUpload() {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [lesson, setLesson] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Fetch courses error:", err);
      }
    }
    fetchCourses();
  }, []);

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
      setCourse("");
      setTitle("");
      setLesson("");
      setDescription("");
      setDuration("");
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      alert("❌ Upload failed: " + (err.response?.data?.message || err.message));
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-accent mb-6">Upload Video</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-darkCard p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4"
      >
        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-800 text-white"
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <input
          type="text"
          placeholder="Lesson / Chapter (e.g., Lesson 1)"
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        ></textarea>

        <input
          type="number"
          placeholder="Duration (seconds)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="w-full text-gray-300"
        />

        <button
          type="submit"
          className="w-full py-2 bg-accent text-darkBg rounded hover:opacity-90"
        >
          Upload Video
        </button>
      </form>
    </div>
  );
}
