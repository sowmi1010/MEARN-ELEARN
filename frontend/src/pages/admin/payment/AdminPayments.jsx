import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Link } from "react-router-dom";
import { FaFilePdf, FaFileExcel, FaUserCircle } from "react-icons/fa";
import useGlobalSearch from "../../../hooks/useGlobalSearch";
import Pagination from "../../../components/common/Pagination";


export default function AdminPayments() {
const { search } = useGlobalSearch("global-search");



  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // =============================
  //  FETCH PAYMENTS
  // =============================
  useEffect(() => {
    async function fetchData() {
      if (!(user.role === "admin" || user.permissions?.includes("payments"))) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const res = await api.get("/payments/all", { headers });

        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.payments || [];

        const sorted = list.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPayments(sorted);
        setFiltered(sorted);
      } catch (err) {
        console.error("Fetch payments error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // =============================
  //  GLOBAL SEARCH (string only)
  // =============================
  useEffect(() => {
    const value = String(search || "").toLowerCase();

    if (!value.trim()) {
      setFiltered(payments);
      return;
    }

    const results = payments.filter((p) => {
      return (
        p?.user?.name?.toLowerCase().includes(value) ||
        p?.user?.email?.toLowerCase().includes(value) ||
        p?.metadata?.title?.toLowerCase().includes(value) ||
        p?.metadata?.group?.toLowerCase().includes(value) ||
        p?.amount?.toString().includes(value)
      );
    });

    setFiltered(results);
    setCurrentPage(1);
  }, [search, payments]);

  // =============================
  //  EXPORT EXCEL
  // =============================
  const exportExcel = () => {
    if (!filtered.length) return alert("No data");

    const ws = XLSX.utils.json_to_sheet(
      filtered.map((p) => ({
        Name: p.user?.name || "Student",
        Email: p.user?.email || p.user,
        Group: p.metadata?.group,
        Course: p.metadata?.title,
        Amount: p.amount,
        Method: p.provider,
        Status: p.status,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "payments.xlsx");
  };

  // =============================
  //  EXPORT PDF
  // =============================
  const exportPDF = () => {
    if (!filtered.length) return alert("No data");

    const doc = new jsPDF();
    doc.text("Payments Report", 14, 16);

    doc.autoTable({
      startY: 22,
      head: [["Name", "Group", "Course", "Amount", "Method", "Status"]],
      body: filtered.map((p) => [
        p.user?.name || "Student",
        p.metadata?.group,
        p.metadata?.title,
        `₹${p.amount}`,
        p.provider,
        p.status,
      ]),
    });

    doc.save("payments.pdf");
  };

  const totalIncome = filtered.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Pagination
  const last = currentPage * perPage;
  const first = last - perPage;
  const currentPayments = filtered.slice(first, last);

  const totalPages = Math.ceil(filtered.length / perPage);

  if (loading)
    return (
      <div className="min-h-screen bg-[#050b18] p-8 text-gray-400">
        Loading payments...
      </div>
    );

  // PERMISSION BLOCK
  if (!(user.role === "admin" || user.permissions?.includes("payments"))) {
    return (
      <div className="min-h-screen bg-[#050b18] text-red-500 flex justify-center items-center text-2xl">
        No Permission
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-[#050b18] text-white">

      {/* TITLE */}
      <h1 className="text-4xl font-extrabold mb-10 text-blue-400 drop-shadow-lg">
        Payments Dashboard
      </h1>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-4 mb-10">
        <button
          onClick={exportExcel}
          className="px-6 py-3 bg-green-600 text-white rounded-xl flex items-center gap-2 hover:scale-105 transition shadow-lg"
        >
          <FaFileExcel /> Export Excel
        </button>

        <button
          onClick={exportPDF}
          className="px-6 py-3 bg-red-600 text-white rounded-xl flex items-center gap-2 hover:scale-105 transition shadow-lg"
        >
          <FaFilePdf /> Export PDF
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard title="Total Income" value={`₹${totalIncome}`} />
        <SummaryCard title="Transactions" value={filtered.length} />
        <SummaryCard title="Students" value={new Set(filtered.map((p) => p?.user)).size} />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-[#071633] p-6 rounded-2xl shadow-2xl border border-blue-500/20">

        <table className="min-w-full text-sm">
          <thead className="bg-[#0d1f3a]">
            <tr className="text-blue-300 border-b border-blue-800">
              <th className="p-3">Student</th>
              <th className="p-3">Group</th>
              <th className="p-3">Course</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Method</th>
              <th className="p-3">Status</th>
              <th className="p-3">Profile</th>
            </tr>
          </thead>

          <tbody>
            {currentPayments.map((p) => (
              <tr
                key={p._id}
                className="border-b border-blue-900 hover:bg-[#0b2a55] transition"
              >
                <td className="p-3">
                  <p className="font-semibold">{p.user?.name || "Student"}</p>
                  <p className="text-gray-400 text-xs">
                    {p.user?.email || p.user}
                  </p>
                </td>

                <td className="p-3 text-cyan-400 font-bold">
                  {p.metadata?.group?.toUpperCase()}
                </td>

                <td className="p-3">{p.metadata?.title}</td>

                <td className="p-3 text-green-400 font-semibold">
                  ₹ {p.amount}
                </td>

                <td className="p-3 uppercase text-blue-400">
                  {p.provider}
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      p.status === "successful"
                        ? "bg-green-600"
                        : p.status === "failed"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="p-3 text-center">
                  {p?.user && (
                    <Link
                      to={`/admin/students/details/${p.user}`}
                      className="inline-flex items-center gap-1 bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-700 transition"
                    >
                      <FaUserCircle /> View
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* PAGINATION */}
              <div className="mt-10 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </div>

        {/* EMPTY STATE */}
        {currentPayments.length === 0 && (
          <p className="text-center p-10 text-gray-400 text-lg">
            No payment records found.
          </p>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 rounded-2xl shadow-2xl hover:scale-105 transition border border-blue-400/30">
      <p className="text-white/70 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}
