import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

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

        const res = await api.get("/payments/all", { headers });

        const list =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.payments)
            ? res.data.payments
            : [];

        // ✅ SORT - LATEST FIRST
        const sorted = list.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPayments(sorted);
        setFiltered(sorted);
      } catch (err) {
        console.error("Fetch payments error:", err);
        setPayments([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ✅ FILTER FUNCTION
  const handleFilter = (value) => {
    setFilter(value);
    setCurrentPage(1);

    if (!value) return setFiltered(payments);

    const f = value.toLowerCase();

    setFiltered(
      payments.filter(
        (p) =>
          p?.user?.email?.toLowerCase().includes(f) ||
          p?.metadata?.title?.toLowerCase().includes(f) ||
          p?.metadata?.group?.toLowerCase().includes(f)
      )
    );
  };

  // ✅ EXPORT EXCEL
  const exportExcel = () => {
    if (filtered.length === 0) return alert("No payments");

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
    if (filtered.length === 0) return alert("No payments");

    const doc = new jsPDF();
    doc.text("Payments Report", 14, 16);

    doc.autoTable({
      startY: 24,
      head: [[
        "Name",
        "Group",
        "Course",
        "Amount",
        "Method",
        "Status"
      ]],
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

  // ✅ TOTAL
  const totalIncome = filtered.reduce((sum, p) => sum + (p.amount || 0), 0);

  // ✅ PAGINATION
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentPayments = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / perPage);

  if (loading)
    return <div className="p-6 text-gray-400">Loading payments...</div>;

  if (!(user.role === "admin" || user.permissions?.includes("payments"))) {
    return (
      <div className="p-8 min-h-screen bg-[#050b18] text-red-500 text-xl">
        No Permission
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#050b18] text-white">

      <h1 className="text-3xl font-bold text-purple-400 mb-6">
        💳 Payments Dashboard
      </h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by email / group / course..."
          value={filter}
          onChange={(e) => handleFilter(e.target.value)}
          className="px-4 py-2 w-80 bg-[#0d1633] rounded-xl border border-purple-700 outline-none"
        />

        <button onClick={exportExcel} className="px-6 py-2 bg-green-600 rounded-xl">
          Export Excel
        </button>

        <button onClick={exportPDF} className="px-6 py-2 bg-red-600 rounded-xl">
          Export PDF
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="💰 Total Income" value={`₹${totalIncome}`} />
        <SummaryCard title="💳 Transactions" value={filtered.length} />
        <SummaryCard
          title="👩‍🎓 Students"
          value={new Set(filtered.map(p => p?.user?.email)).size}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-[#071633] p-6 rounded-2xl shadow-xl">

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-purple-300 border-b border-purple-800">
              <th className="p-3">Student</th>
              <th className="p-3">Group</th>
              <th className="p-3">Details</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Method</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment ID</th>
            </tr>
          </thead>

          <tbody>
            {currentPayments.map((p) => (
              <tr key={p._id} className="border-b border-purple-900">
                <td className="p-3">
                  <p className="font-semibold">{p.user?.name}</p>
                  <p className="text-gray-400 text-xs">
                    {p.user?.email}
                  </p>
                </td>

                <td className="p-3 text-cyan-400 font-bold">
                  {p.metadata?.group?.toUpperCase()}
                </td>

                <td className="p-3 text-gray-300">
                  {p.metadata?.standard && (
                    <p>
                      {p.metadata.standard} | {p.metadata.board} | {p.metadata.language}
                    </p>
                  )}

                  {p.metadata?.groupCode && (
                    <p className="text-yellow-400 text-xs">
                      {p.metadata.groupCode}
                    </p>
                  )}

                  {!p.metadata?.standard && p.metadata?.title}
                </td>

                <td className="p-3 text-green-400 font-semibold">
                  ₹ {p.amount}
                </td>

                <td className="p-3 uppercase text-indigo-400">
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

                <td className="p-3 text-xs text-gray-400">
                  {p.providerPaymentId}
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

        {/* ✅ PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">

            {/* PER PAGE */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                Rows per page
              </span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#0d1633] border border-purple-600 px-2 py-1 rounded-lg"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            {/* PAGES */}
            <div className="flex gap-2 items-center">

              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-[#162447] rounded disabled:opacity-40"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3 py-1 rounded 
                  ${currentPage === num ? "bg-purple-600" : "bg-[#162447]"}`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
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
    <div className="p-6 bg-gradient-to-br from-purple-700 to-indigo-700 rounded-2xl shadow-xl">
      <p className="text-white/70">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}
