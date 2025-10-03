import React, { useState, useEffect } from "react";
import api from "../../utils/api";

export default function AddCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [courses, setCourses] = useState([]);
  const [editId, setEditId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

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

  useEffect(() => {
    if (user.role === "admin") loadCourses();
  }, [user.role]);

  async function loadCourses() {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Fetch courses error:", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (editId) {
        await api.put(
          `/courses/${editId}`,
          { title, description, category, price },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("✅ Course updated!");
      } else {
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
      alert("❌ Failed: " + (err.response?.data?.message || err.message));
    }
  }

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
      alert("❌ Failed to delete course");
    }
  }

  function startEdit(course) {
    setEditId(course._id);
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category);
    setPrice(course.price);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditId(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setPrice("");
  }

  // 🚫 No Access
  if (user.role !== "admin") {
    return (
      <div className="p-10 min-h-screen bg-gray-100 dark:bg-darkBg text-red-500 text-xl font-bold">
        🚫 You do not have permission to manage courses.
      </div>
    );
  }

  return (
    <div className="pt-10 px-6 min-h-screen bg-gray-100 dark:bg-darkBg transition-colors duration-300">
      {/* ===== PAGE TITLE ===== */}
      <h1 className="text-4xl font-extrabold mb-10 text-center">
        <span className="bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent">
          {editId ? "✏️ Edit Course" : "➕ Add New Course"}
        </span>
      </h1>

      {/* ===== FORM ===== */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-white dark:bg-darkCard
          p-8 rounded-2xl shadow-xl max-w-2xl mx-auto
          border border-gray-200 dark:border-gray-700
          space-y-5 transition-colors
        "
      >
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
            Course Title
          </label>
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="
              w-full p-3 rounded-lg
              bg-gray-50 dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              focus:border-accent outline-none
              text-gray-800 dark:text-gray-100
            "
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="
              w-full p-3 rounded-lg
              bg-gray-50 dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              focus:border-accent outline-none
              text-gray-800 dark:text-gray-100
            "
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="
                w-full p-3 rounded-lg
                bg-gray-50 dark:bg-gray-800
                border border-gray-300 dark:border-gray-600
                focus:border-accent outline-none
                text-gray-800 dark:text-gray-100
              "
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Price (₹)
            </label>
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="
                w-full p-3 rounded-lg
                bg-gray-50 dark:bg-gray-800
                border border-gray-300 dark:border-gray-600
                focus:border-accent outline-none
                text-gray-800 dark:text-gray-100
              "
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="
              flex-1 py-3 rounded-lg font-bold shadow-lg
              bg-gradient-to-r from-accent to-blue-500 text-darkBg
              hover:scale-[1.03] transition-transform duration-300
            "
          >
            {editId ? "Update Course" : "Add Course"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="
                flex-1 py-3 rounded-lg bg-gray-400 dark:bg-gray-600
                text-white font-semibold hover:bg-gray-500
                transition-colors duration-300
              "
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ===== COURSE LIST ===== */}
      <div className="max-w-5xl mx-auto mt-14">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-accent">
          📚 All Courses
        </h2>
        <div
          className="
            overflow-x-auto rounded-2xl shadow-lg
            border border-gray-200 dark:border-gray-700
          "
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((c, i) => (
                  <tr
                    key={c._id}
                    className={`
                      border-b border-gray-200 dark:border-gray-700
                      hover:bg-accent/10 dark:hover:bg-accent/20
                      transition-colors duration-200
                      ${i % 2 === 0 ? "bg-gray-50 dark:bg-darkBg" : "bg-white dark:bg-darkCard"}
                    `}
                  >
                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-100">
                      {c.title}
                    </td>
                    <td className="p-4">
                      <span
                        className="
                          px-3 py-1 rounded-full text-sm font-semibold
                          bg-gradient-to-r from-accent to-blue-500 text-darkBg
                          shadow-sm
                        "
                      >
                        {c.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-green-600 dark:text-green-400">
                      ₹{c.price}
                    </td>
                    <td className="p-4 space-x-3">
                      <button
                        onClick={() => startEdit(c)}
                        className="
                          px-4 py-2 rounded-lg
                          bg-blue-500 hover:bg-blue-600 text-white font-semibold
                          transition duration-200 shadow
                        "
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCourse(c._id)}
                        className="
                          px-4 py-2 rounded-lg
                          bg-red-500 hover:bg-red-600 text-white font-semibold
                          transition duration-200 shadow
                        "
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-6 text-center text-gray-500 dark:text-gray-400 font-medium"
                  >
                    No courses available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
