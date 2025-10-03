import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function EnrolledStudentList() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function fetchCourses() {
      if (!(user.role === "admin" || user.permissions?.includes("students"))) {
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
      console.error("❌ Fetch students error:", err.response?.data || err.message);
      setStudents([]);
    }
  }

  // 🔹 Export to Excel
  function exportToExcel() {
    if (students.length === 0) return alert("No students to export!");
    const data = students.map((s) => ({
      Name: s.name,
      Email: s.email,
      Joined: new Date(s.createdAt).toLocaleDateString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students.xlsx");
  }

  // 🔹 Export to PDF
  function exportToPDF() {
    if (students.length === 0) return alert("No students to export!");
    const doc = new jsPDF();
    doc.text("Student List", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Name", "Email", "Joined"]],
      body: students.map((s) => [
        s.name,
        s.email,
        new Date(s.createdAt).toLocaleDateString(),
      ]),
    });
    doc.save("students.pdf");
  }

  if (loading) return <div className="p-6 text-gray-500">Loading students…</div>;

  if (!(user.role === "admin" || user.permissions?.includes("students"))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-darkBg text-red-500 text-lg font-semibold">
        🚫 You do not have permission to view student data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBg transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-blue-500 text-darkBg dark:text-white py-10 shadow">
        <h1 className="text-center text-4xl font-extrabold">
          👨‍🎓 Enrolled Students by Course
        </h1>
      </div>

      <div className="max-w-6xl mx-auto -mt-8 p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <select
            value={selectedCourse}
            onChange={(e) => loadStudents(e.target.value)}
            className="w-full sm:w-80 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-accent outline-none"
          >
            <option value="">-- Select a Course --</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>

          {students.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={exportToExcel}
                className="px-5 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
              >
                📊 Export Excel
              </button>
              <button
                onClick={exportToPDF}
                className="px-5 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
              >
                📄 Export PDF
              </button>
            </div>
          )}
        </div>

        {/* Student Table */}
        {selectedCourse ? (
          students.length > 0 ? (
            <div className="overflow-x-auto bg-white dark:bg-darkCard rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr
                      key={s._id}
                      className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                        i % 2 === 0 ? "bg-gray-50 dark:bg-darkBg" : "bg-white dark:bg-darkCard"
                      }`}
                    >
                      <td className="p-4 font-medium text-gray-800 dark:text-gray-100">{s.name}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{s.email}</td>
                      <td className="p-4 text-gray-500">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
              🚫 No students enrolled in this course yet.
            </p>
          )
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
            📌 Please select a course to view enrolled students.
          </p>
        )}
      </div>
    </div>
  );
}
