import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import * as XLSX from "xlsx"; // ✅ for Excel export
import jsPDF from "jspdf"; // ✅ for PDF export
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
        return; // ❌ no access for this user
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

  // ✅ Export to Excel
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

  // ✅ Export to PDF
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

  if (loading) {
    return <div className="p-6 text-gray-400">Loading students...</div>;
  }

  // ❌ No Access Case
  if (!(user.role === "admin" || user.permissions?.includes("students"))) {
    return (
      <div className="p-8 min-h-screen bg-darkBg text-red-400 text-xl font-semibold">
        🚫 You do not have permission to view student data.
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-darkBg text-gray-200">
      <h1 className="text-3xl font-extrabold text-accent mb-8 tracking-wide">
        👨‍🎓 Students by Course
      </h1>

      {/* 🔹 Select Course Dropdown */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <select
          value={selectedCourse}
          onChange={(e) => loadStudents(e.target.value)}
          className="p-3 bg-darkCard border border-gray-700 text-white rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-accent transition"
        >
          <option value="">-- Choose a Course --</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        {/* ✅ Export Buttons */}
        {students.length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            >
              📊 Export Excel
            </button>
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
            >
              📄 Export PDF
            </button>
          </div>
        )}
      </div>

      {/* 🔹 Students List */}
      {selectedCourse ? (
        students.length > 0 ? (
          <div className="overflow-x-auto bg-darkCard rounded-xl shadow-lg border border-gray-700">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr
                    key={s._id}
                    className={`border-b border-gray-700 hover:bg-gray-800/50 transition ${
                      i % 2 === 0 ? "bg-darkBg" : "bg-darkCard"
                    }`}
                  >
                    <td className="p-4 font-semibold">{s.name}</td>
                    <td className="p-4 text-gray-400">{s.email}</td>
                    <td className="p-4 text-gray-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-lg">
            🚫 No students enrolled in this course yet.
          </p>
        )
      ) : (
        <p className="text-gray-500 text-lg">
          📌 Please select a course to view enrolled students.
        </p>
      )}
    </div>
  );
}
