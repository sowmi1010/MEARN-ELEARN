import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseFilter, setCourseFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function fetchData() {
      if (!(user.role === "admin" || user.permissions?.includes("payments"))) {
        setLoading(false);
        return; // ❌ no access
      }
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const res = await api.get("/payments/all", { headers });
        setPayments(res.data);
        setFiltered(res.data);

        const res2 = await api.get("/courses", { headers });
        setCourses(res2.data);
      } catch (err) {
        console.error("❌ Fetch payments error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user.role, user.permissions]);

  // ✅ Filter by course
  function handleFilter(courseId) {
    setCourseFilter(courseId);
    setFiltered(
      courseId ? payments.filter((p) => p.course?._id === courseId) : payments
    );
  }

  // ✅ Export Excel
  function exportExcel() {
    if (filtered.length === 0) return alert("No payments to export!");
    const ws = XLSX.utils.json_to_sheet(
      filtered.map((p) => ({
        Student: p.student?.name,
        Email: p.student?.email,
        Course: p.course?.title,
        Amount: p.amount,
        Date: new Date(p.createdAt).toLocaleDateString(),
        Status: p.status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "payments_report.xlsx");
  }

  // ✅ Export PDF
  function exportPDF() {
    if (filtered.length === 0) return alert("No payments to export!");
    const doc = new jsPDF();
    doc.text("Payments Report", 14, 16);
    doc.autoTable({
      startY: 22,
      head: [["Student", "Email", "Course", "Amount", "Date", "Status"]],
      body: filtered.map((p) => [
        p.student?.name,
        p.student?.email,
        p.course?.title,
        `₹${p.amount}`,
        new Date(p.createdAt).toLocaleDateString(),
        p.status,
      ]),
    });
    doc.save("payments_report.pdf");
  }

  const totalIncome = filtered.reduce((sum, p) => sum + p.amount, 0);

  if (loading) return <div className="p-6 text-gray-500">Loading payments...</div>;

  if (!(user.role === "admin" || user.permissions?.includes("payments"))) {
    return (
      <div className="p-8 min-h-screen bg-gray-100 dark:bg-darkBg text-red-500 text-xl font-semibold flex items-center justify-center">
        🚫 You do not have permission to view payment data.
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-darkBg transition-colors duration-300">
      {/* 🔹 Page Title */}
      <h1 className="text-3xl font-extrabold text-accent mb-8">💳 Payments</h1>

      {/* 🔹 Filters + Export */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={courseFilter}
          onChange={(e) => handleFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkCard text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-accent outline-none"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        <button
          onClick={exportExcel}
          className="px-5 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition-transform duration-300"
        >
          📊 Export Excel
        </button>

        <button
          onClick={exportPDF}
          className="px-5 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold rounded-lg shadow hover:scale-105 transition-transform duration-300"
        >
          📄 Export PDF
        </button>
      </div>

      {/* 🔹 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <SummaryCard title="Total Income" value={`₹${totalIncome}`} color="from-green-400 to-emerald-600" />
        <SummaryCard title="Transactions" value={filtered.length} color="from-purple-400 to-pink-500" />
        <SummaryCard title="Courses" value={courses.length} color="from-cyan-400 to-blue-500" />
      </div>

      {/* 🔹 Payments Table */}
      <div className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-xl overflow-x-auto border border-gray-200 dark:border-gray-700">
        {filtered.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No payments found</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-left">
                <th className="p-3">Student</th>
                <th className="p-3">Email</th>
                <th className="p-3">Course</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr
                  key={p._id}
                  className={`hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    idx % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-900/40"
                      : "bg-gray-100 dark:bg-gray-800/50"
                  }`}
                >
                  <td className="p-3 font-medium text-gray-800 dark:text-gray-100">
                    {p.student?.name}
                  </td>
                  <td className="p-3 text-gray-500 dark:text-gray-300">{p.student?.email}</td>
                  <td className="p-3 text-gray-800 dark:text-gray-200">{p.course?.title}</td>
                  <td className="p-3 text-green-500 font-semibold">₹{p.amount}</td>
                  <td className="p-3 text-gray-500 dark:text-gray-300">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className={`p-3 font-semibold ${
                      p.status === "success" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {p.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// 🔹 Summary Card Component
function SummaryCard({ title, value, color }) {
  return (
    <div
      className={`p-6 rounded-xl shadow-lg text-darkBg bg-gradient-to-r ${color} transform hover:scale-105 transition-transform duration-300 text-center`}
    >
      <h3 className="text-sm font-bold opacity-80">{title}</h3>
      <p className="text-3xl font-extrabold mt-2">{value}</p>
    </div>
  );
}
