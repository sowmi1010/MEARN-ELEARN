import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Link } from "react-router-dom";
import { FaFilePdf, FaFileExcel, FaUserCircle } from "react-icons/fa";
import useGlobalSearch from "../../../hooks/useGlobalSearch";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Global search from AdminLayout
  const search = useGlobalSearch();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ FETCH PAYMENTS
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

  // ✅ APPLY GLOBAL SEARCH FILTER
  useEffect(() => {
    if (!search) {
      setFiltered(payments);
      return;
    }

    const f = search.toLowerCase();

    setFiltered(
      payments.filter(
        (p) =>
          p?.user?.name?.toLowerCase().includes(f) ||
          p?.user?.email?.toLowerCase().includes(f) ||
          p?.metadata?.title?.toLowerCase().includes(f) ||
          p?.metadata?.group?.toLowerCase().includes(f) ||
          p?.amount?.toString().includes(f)
      )
    );

    setCurrentPage(1);
  }, [search, payments]);

  // ✅ EXPORT EXCEL
  const exportExcel = () => {
    if (!filtered.length) return alert("No data");

    const ws = XLSX.utils.json_to_sheet(
      filtered.map((p) => ({
        Name: p.user?.name,
        Email: p.user?.email,
        Group: p.metadata?.group,
        Course: p.metadata?.title,
        Standard: p.metadata?.standard,
        Board: p.metadata?.board,
        Language: p.metadata?.language,
        Amount: p.amount,
        Method: p.provider,
        Status: p.status,
        PaymentID: p.providerPaymentId,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "payments.xlsx");
  };

  // ✅ EXPORT PDF
  const exportPDF = () => {
    if (!filtered.length) return alert("No data");

    const doc = new jsPDF();
    doc.text("Payments Report", 14, 16);

    doc.autoTable({
      startY: 22,
      head: [["Name", "Group", "Course", "Amount", "Method", "Status"]],
      body: filtered.map((p) => [
        p.user?.name,
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

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentPayments = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / perPage);

  if (loading)
    return (
      <div className="min-h-screen bg-[#050b18] p-8 text-gray-400">
        Loading payments...
      </div>
    );

  if (!(user.role === "admin" || user.permissions?.includes("payments"))) {
    return (
      <div className="min-h-screen bg-[#050b18] text-red-500 flex justify-center items-center text-2xl">
        No Permission
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-[#050b18] text-white">

      <h1 className="text-4xl font-extrabold mb-10 text-blue-400">
        Payments Dashboard
      </h1>

      {/* ACTION BAR */}
      <div className="flex flex-wrap gap-4 mb-10">
        <button
          onClick={exportExcel}
          className="px-6 py-3 bg-green-600 rounded-xl flex items-center gap-2 hover:scale-105 transition"
        >
          <FaFileExcel /> Export Excel
        </button>

        <button
          onClick={exportPDF}
          className="px-6 py-3 bg-red-600 rounded-xl flex items-center gap-2 hover:scale-105 transition"
        >
          <FaFilePdf /> Export PDF
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard title="Total Income" value={`₹${totalIncome}`} />
        <SummaryCard title="Transactions" value={filtered.length} />
        <SummaryCard
          title="Students"
          value={new Set(filtered.map((p) => p?.user?.email)).size}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-[#071633] p-6 rounded-2xl shadow-2xl">

        <table className="min-w-full text-sm">
          <thead>
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
                  <p className="font-semibold">{p.user?.name}</p>
                  <p className="text-gray-400 text-xs">
                    {p.user?.email}
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
                    className={`px-3 py-1 rounded-full text-xs font-bold
                    ${
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
                  {p?.user?._id && (
                    <Link
                      to={`/admin/students/details/${p.user._id}`}
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

        {currentPayments.length === 0 && (
          <p className="text-center p-10 text-gray-400">
            No payment records found.
          </p>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Rows</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#0d1633] border border-blue-600 px-2 py-1 rounded-lg"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-[#162447] rounded disabled:opacity-40"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3 py-1 rounded ${
                    currentPage === num
                      ? "bg-blue-600"
                      : "bg-[#162447]"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-[#162447] rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl shadow-2xl hover:scale-105 transition">
      <p className="text-white/70">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}
