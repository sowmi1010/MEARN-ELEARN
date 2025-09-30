import React, { useEffect, useState } from "react";
import api from "../../utils/api";
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

        // fetch all payments
        const res = await api.get("/payments/all", { headers });
        setPayments(res.data);
        setFiltered(res.data);

        // fetch courses
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

  // ✅ filter by course
  function handleFilter(courseId) {
    setCourseFilter(courseId);
    if (!courseId) {
      setFiltered(payments);
    } else {
      setFiltered(payments.filter((p) => p.course?._id === courseId));
    }
  }

  // ✅ export to Excel
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

  // ✅ export to PDF
  function exportPDF() {
    if (filtered.length === 0) return alert("No payments to export!");

    const doc = new jsPDF();
    doc.text("Payments Report", 14, 16);
    doc.autoTable({
      startY: 20,
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

  if (loading) {
    return <div className="p-6 text-gray-400">Loading payments...</div>;
  }

  // ❌ No Access Case
  if (!(user.role === "admin" || user.permissions?.includes("payments"))) {
    return (
      <div className="p-8 min-h-screen bg-darkBg text-red-400 text-xl font-semibold">
        🚫 You do not have permission to view payment data.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-accent mb-6">💳 Payments</h1>

      {/* 🔹 Filters + Export */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={courseFilter}
          onChange={(e) => handleFilter(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
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
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
        >
          📊 Export Excel
        </button>
        <button
          onClick={exportPDF}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          📄 Export PDF
        </button>
      </div>

      {/* 🔹 Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-darkCard p-4 rounded-lg text-center">
          <h3 className="text-gray-400">Total Income</h3>
          <p className="text-2xl font-bold text-green-400">₹{totalIncome}</p>
        </div>
        <div className="bg-darkCard p-4 rounded-lg text-center">
          <h3 className="text-gray-400">Transactions</h3>
          <p className="text-2xl font-bold">{filtered.length}</p>
        </div>
        <div className="bg-darkCard p-4 rounded-lg text-center">
          <h3 className="text-gray-400">Courses</h3>
          <p className="text-2xl font-bold">{courses.length}</p>
        </div>
      </div>

      {/* 🔹 Payments Table */}
      <div className="bg-darkCard p-6 rounded-lg shadow overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="text-gray-400">No payments found</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-gray-300 text-left">
                <th className="p-3 border-b border-gray-700">Student</th>
                <th className="p-3 border-b border-gray-700">Email</th>
                <th className="p-3 border-b border-gray-700">Course</th>
                <th className="p-3 border-b border-gray-700">Amount</th>
                <th className="p-3 border-b border-gray-700">Date</th>
                <th className="p-3 border-b border-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-gray-800/50 transition border-b border-gray-700"
                >
                  <td className="p-3">{p.student?.name}</td>
                  <td className="p-3 text-gray-400">{p.student?.email}</td>
                  <td className="p-3">{p.course?.title}</td>
                  <td className="p-3 text-green-400">₹{p.amount}</td>
                  <td className="p-3 text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className={`p-3 font-semibold ${
                      p.status === "success" ? "text-green-400" : "text-red-400"
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
