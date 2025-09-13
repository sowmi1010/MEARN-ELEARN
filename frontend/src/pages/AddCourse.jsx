import React, { useState, useEffect } from "react";
import api from "../utils/api";

export default function AddCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [courses, setCourses] = useState([]);
  const [editId, setEditId] = useState(null);

  const categories = [
    "1-6",
    "7-10",
    "11-12",
    "Tamil",
    "English",
    "FullStack",
    "AWS",
    "AI-ML",
  ];

  // Load courses when page loads
  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("❌ Fetch courses error:", err);
    }
  }

  // Create or Update course
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (editId) {
        // Update
        await api.put(
          `/courses/${editId}`,
          { title, description, category, price },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("✅ Course updated!");
      } else {
        // Create
        await api.post(
          "/courses",
          { title, description, category, price },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("✅ Course created!");
      }

      resetForm();
      loadCourses();
    } catch (err) {
      console.error("❌ Add/Update course error:", err.response?.data || err.message);
      alert("❌ Failed: " + (err.response?.data?.message || err.message));
    }
  }

  // Delete a course
  async function deleteCourse(id) {
    if (!window.confirm("Delete this course?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Course deleted!");
      loadCourses();
    } catch (err) {
      console.error("❌ Delete course error:", err);
      alert("❌ Failed to delete course");
    }
  }

  // Start editing
  function startEdit(course) {
    setEditId(course._id);
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category);
    setPrice(course.price);
  }

  // Reset form
  function resetForm() {
    setEditId(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setPrice("");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-accent mb-6">
        {editId ? "Edit Course" : "Add New Course"}
      </h1>

      {/* Course Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-darkCard p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4 mb-8"
      >
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        ></textarea>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-800 text-white"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 py-2 bg-accent text-darkBg rounded hover:opacity-90"
          >
            {editId ? "Update Course" : "Add Course"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-2 bg-gray-500 text-white rounded hover:opacity-90"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Course List */}
      <h2 className="text-2xl font-bold text-accent mb-4">📚 All Courses</h2>
      <table className="w-full bg-darkCard rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((c) => (
              <tr key={c._id} className="border-b border-gray-700">
                <td className="p-3">{c.title}</td>
                <td className="p-3">{c.category}</td>
                <td className="p-3">₹{c.price}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => startEdit(c)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCourse(c._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-400">
                No courses available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
