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
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // --- GET PAYMENTS ---
        const res = await api.get("/payments/all", { headers });

        // Normalize to array ALWAYS
        const list =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.payments)
            ? res.data.payments
            : [];

        setPayments(list);
        setFiltered(list);

        // --- GET COURSES ---
        const res2 = await api.get("/courses", { headers });
        const courseList =
          Array.isArray(res2.data)
            ? res2.data
            : Array.isArray(res2.data.courses)
            ? res2.data.courses
            : [];

        setCourses(courseList);
      } catch (err) {
        console.error("Fetch payments error:", err.response?.data || err.message);
        setPayments([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user.role, user.permissions]);

  // --------------------- FILTER ----------------------
  const handleFilter = (courseId) => {
    setCourseFilter(courseId);
    setFiltered(
      courseId ? payments.filter((p) => p.course?._id === courseId) : payments
    );
  };

  // --------------------- EXPORT EXCEL ----------------------
  const exportExcel = () => {
    if (filtered.length === 0) return alert("No payments to export!");

    const ws = XLSX.utils.json_to_sheet(
      filtered.map((p) => ({
        Student: p.user?.name,
        Email: p.user?.email,
        Course: p.course?.title,
        Amount: p.amount,
        Date: new Date(p.createdAt).toLocaleString(),
        Status: p.status,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "payments_report.xlsx");
  };

  // --------------------- EXPORT PDF ----------------------
  const exportPDF = () => {
    if (filtered.length === 0) return alert("No payments to export!");

    const doc = new jsPDF();
    doc.text("Payments Report", 14, 16);

    doc.autoTable({
      startY: 22,
      head: [["Student", "Email", "Course", "Amount", "Date", "Status"]],
      body: filtered.map((p) => [
        p.user?.name,
        p.user?.email,
        p.course?.title,
        `₹${p.amount}`,
        new Date(p.createdAt).toLocaleString(),
        p.status,
      ]),
    });

    doc.save("payments_report.pdf");
  };

  // --------------------- TOTAL INCOME ----------------------
  const totalIncome = Array.isArray(filtered)
    ? filtered.reduce((sum, p) => sum + (p.amount || 0), 0)
    : 0;

  // --------------------- LOADING ----------------------
  if (loading) return <div className="p-6 text-gray-500">Loading payments...</div>;

  // --------------------- PERMISSION ----------------------
  if (!(user.role === "admin" || user.permissions?.includes("payments"))) {
    return (
      <div className="p-8 min-h-screen bg-gray-100 text-red-500 text-xl font-semibold">
        You do not have permission to view payment data.
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-darkBg">
      <h1 className="text-3xl font-extrabold text-accent mb-8">💳 Payments</h1>

      {/* FILTER + EXPORT BUTTONS */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={courseFilter}
          onChange={(e) => handleFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        <button onClick={exportExcel} className="px-5 py-2 bg-green-500 text-white rounded-lg">
          Export Excel
        </button>
        <button onClick={exportPDF} className="px-5 py-2 bg-red-500 text-white rounded-lg">
          Export PDF
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        <SummaryCard title="Total Income" value={`₹${totalIncome}`} color="from-green-400 to-green-600" />
        <SummaryCard title="Transactions" value={filtered.length} color="from-purple-400 to-pink-500" />
        <SummaryCard title="Courses" value={courses.length} color="from-blue-400 to-blue-600" />
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow">
        {filtered.length === 0 ? (
          <p>No payments found</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3">Student</th>
                <th className="p-3">Email</th>
                <th className="p-3">Course</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p._id}>
                  <td className="p-3">{p.user?.name}</td>
                  <td className="p-3">{p.user?.email}</td>
                  <td className="p-3">{p.course?.title}</td>
                  <td className="p-3">₹{p.amount}</td>
                  <td className="p-3">{new Date(p.createdAt).toLocaleString()}</td>
                  <td className="p-3">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className={`p-6 rounded-xl text-white bg-gradient-to-r ${color}`}>
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="text-3xl font-extrabold mt-2">{value}</p>
    </div>
  );
}
