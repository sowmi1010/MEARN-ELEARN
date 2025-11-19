import React, { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";

/**
 * Marks — improved UI
 * - Summary (avg / best / worst)
 * - Sort control
 * - Color-coded progress bars
 * - Export CSV
 */

function percentColor(p) {
  if (p >= 80) return "bg-green-500";
  if (p >= 60) return "bg-yellow-400";
  if (p >= 40) return "bg-orange-400";
  return "bg-red-500";
}

function format2(n) {
  return Math.round(n * 100) / 100;
}

export default function Marks() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent"); // recent | subject | percentage
  const [query, setQuery] = useState("");

  const loadMarks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get("/marks/student", { headers });
      // ensure we have percentage field (calc if needed)
      const data = (res.data || []).map((m) => ({
        ...m,
        percentage:
          typeof m.percentage === "number"
            ? m.percentage
            : m.totalMarks
            ? format2((m.marksObtained / m.totalMarks) * 100)
            : 0,
      }));
      setMarks(data);
    } catch (err) {
      console.error("Marks loading error:", err);
      setMarks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarks();
    // eslint-disable-next-line
  }, []);

  // derived values: average, best, worst
  const summary = useMemo(() => {
    if (!marks.length) return { avg: 0, best: null, worst: null };
    const avg = marks.reduce((s, m) => s + (m.percentage || 0), 0) / marks.length;
    const sorted = [...marks].sort((a, b) => b.percentage - a.percentage);
    return { avg: format2(avg), best: sorted[0], worst: sorted[sorted.length - 1] };
  }, [marks]);

  // filtering + sorting
  const displayed = useMemo(() => {
    let list = marks.slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) =>
          (m.subject || "").toLowerCase().includes(q) ||
          (m.testName || "").toLowerCase().includes(q)
      );
    }

    if (sortBy === "subject") {
      list.sort((a, b) => (a.subject || "").localeCompare(b.subject || ""));
    } else if (sortBy === "percentage") {
      list.sort((a, b) => b.percentage - a.percentage);
    } else {
      // recent: sort by createdAt if exists, else keep order
      list.sort((a, b) => {
        const da = new Date(a.createdAt || a._id?.toString().slice(0, 8) || 0).getTime();
        const db = new Date(b.createdAt || b._id?.toString().slice(0, 8) || 0).getTime();
        return db - da;
      });
    }

    return list;
  }, [marks, sortBy, query]);

  // CSV export
  const exportCSV = () => {
    if (!marks.length) return;
    const rows = [
      ["Subject", "Test", "Obtained", "Total", "Percentage", "Date"],
      ...marks.map((m) => [
        m.subject || "",
        m.testName || "",
        m.marksObtained ?? "",
        m.totalMarks ?? "",
        m.percentage ?? "",
        m.createdAt ? new Date(m.createdAt).toLocaleString() : "",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marks_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-[#070712] to-[#0b0f1a] text-gray-100">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-purple-300">My Marks</h1>
            <p className="text-sm text-gray-400 mt-1">Progress overview and detailed results</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search subject or test..."
              className="w-full sm:w-64 bg-[#0f1629] border border-purple-800/40 px-3 py-2 rounded-md text-sm placeholder:text-gray-500"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0f1629] border border-purple-800/40 px-3 py-2 rounded-md text-sm"
            >
              <option value="recent">Sort: Recent</option>
              <option value="subject">Sort: Subject</option>
              <option value="percentage">Sort: Percentage</option>
            </select>

            <button
              onClick={exportCSV}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-md text-sm"
              title="Export CSV"
            >
              Export
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#081024] p-4 rounded-xl border border-purple-800/20">
            <div className="text-sm text-gray-400">Average Score</div>
            <div className="text-2xl font-bold text-white mt-1">{summary.avg}%</div>
          </div>

          <div className="bg-[#081024] p-4 rounded-xl border border-purple-800/20">
            <div className="text-sm text-gray-400">Best</div>
            {summary.best ? (
              <>
                <div className="text-lg font-semibold text-purple-300 mt-1">
                  {summary.best.subject} — {summary.best.testName || "Test"}
                </div>
                <div className="text-sm text-gray-400 mt-1">{summary.best.percentage}%</div>
              </>
            ) : <div className="text-gray-500 mt-1">—</div>}
          </div>

          <div className="bg-[#081024] p-4 rounded-xl border border-purple-800/20">
            <div className="text-sm text-gray-400">Needs Attention</div>
            {summary.worst ? (
              <>
                <div className="text-lg font-semibold text-red-400 mt-1">
                  {summary.worst.subject} — {summary.worst.testName || "Test"}
                </div>
                <div className="text-sm text-gray-400 mt-1">{summary.worst.percentage}%</div>
              </>
            ) : <div className="text-gray-500 mt-1">—</div>}
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading && <div className="text-gray-400">Loading marks…</div>}

          {!loading && displayed.length === 0 && (
            <div className="text-center text-gray-500 p-6 bg-[#081024] rounded-xl">
              No marks found.
            </div>
          )}

          {displayed.map((m) => (
            <div key={m._id} className="bg-[#071025] p-4 rounded-xl border border-purple-800/20 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-purple-300 truncate">{m.subject}</div>
                    <div className="text-sm text-gray-400">{m.testName || "Test"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{m.marksObtained}/{m.totalMarks}</div>
                    <div className="text-sm text-gray-400">{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-800 h-3 rounded overflow-hidden">
                    <div
                      className={`${percentColor(m.percentage)} h-3 rounded`}
                      style={{ width: `${Math.min(100, m.percentage || 0)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <div className="text-xs text-gray-400">{m.percentage}%</div>
                    <div className="text-xs text-yellow-300">{m.grade || (m.percentage >= 90 ? "A+" : m.percentage >= 75 ? "A" : m.percentage >= 60 ? "B" : "C")}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
