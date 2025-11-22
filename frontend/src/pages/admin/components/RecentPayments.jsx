import React from "react";
import { FaUser, FaBookOpen, FaRupeeSign } from "react-icons/fa";

export default function RecentPayments({ payments }) {
  return (
    <div className="bg-[#0e162b] p-6 rounded-2xl shadow-xl border border-blue-900/40">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-blue-400">
          Recent Payments
        </h2>

        <span className="text-xs px-3 py-1 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30">
          Last 5 Transactions
        </span>
      </div>

      {payments.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          No payments available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-3">

            <thead>
              <tr className="text-gray-400 text-xs uppercase">
                <th className="p-2">User</th>
                <th className="p-2">Course</th>
                <th className="p-2">Amount</th>
                <th className="p-2 text-right">Date</th>
              </tr>
            </thead>

            <tbody>
              {payments
                .slice(-5)
                .reverse()
                .map((p, i) => (
                  <tr
                    key={i}
                    className="
                      bg-[#0b1224]
                      border border-blue-900/40
                      hover:border-blue-500/60
                      transition rounded-xl
                    "
                  >
                    {/* USER */}
                    <td className="p-4 flex items-center gap-2 rounded-l-xl">
                      <FaUser className="text-blue-400 text-sm" />
                      <span className="text-gray-200">
                        {p.user?.name || "Unknown"}
                      </span>
                    </td>

                    {/* COURSE */}
                    <td className="p-4 flex items-center gap-2">
                      <FaBookOpen className="text-blue-300 text-sm" />
                      <span className="text-gray-300">
                        {p.course?.title || "N/A"}
                      </span>
                    </td>

                    {/* AMOUNT */}
                    <td className="p-4 flex items-center gap-2 font-semibold">
                      <FaRupeeSign className="text-green-400" />
                      <span className="text-green-400">
                        {p.amount}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="p-4 text-right text-gray-400 rounded-r-xl">
                      {new Date(p.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                  </tr>
                ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}
