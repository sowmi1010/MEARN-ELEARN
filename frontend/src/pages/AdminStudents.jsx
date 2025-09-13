import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function AdminStudents() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
      } catch (err) {
        console.error("❌ Fetch courses error:", err);
      }
    }
    fetchCourses();
  }, []);

  async function loadStudents(courseId) {
    setSelectedCourse(courseId);
    if (!courseId) {
      setStudents([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/courses/${courseId}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error("❌ Fetch students error:", err);
      setStudents([]);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-accent mb-4">Students by Course</h1>

      {/* Select Course Dropdown */}
      <select
        value={selectedCourse}
        onChange={(e) => loadStudents(e.target.value)}
        className="mb-4 p-2 bg-gray-800 text-white rounded"
      >
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.title}
          </option>
        ))}
      </select>

      {/* Students List */}
      {selectedCourse ? (
        students.length > 0 ? (
          <ul className="space-y-2">
            {students.map((s) => (
              <li
                key={s._id}
                className="bg-darkCard p-3 rounded flex justify-between"
              >
                <span>
                  {s.name} ({s.email})
                </span>
                <span className="text-gray-400 text-sm">
                  Joined {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">🚫 No students enrolled in this course yet</p>
        )
      ) : (
        <p className="text-gray-500">📌 Please select a course to view students</p>
      )}
    </div>
  );
}
