import React from "react";
import {
  FaUser,
  FaBookOpen,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

export default function RecentPayments({ payments = [] }) {
  // Handle different API formats safely
  const list = Array.isArray(payments)
    ? payments
    : payments?.payments || [];

  return (
    <div className="bg-[#0e162b] p-6 rounded-2xl shadow-xl border border-blue-900/40">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-blue-400">Recent Payments</h2>

        <span className="text-xs px-3 py-1 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30">
          Last 5 Transactions
        </span>
      </div>

      {list.length === 0 ? (
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
                <th className="p-2">Status</th>
                <th className="p-2 text-right">Date</th>
              </tr>
            </thead>

            <tbody>
              {list
                .slice(-5)
                .reverse()
                .map((p, i) => {
                  const userName =
                    p.user?.name ||
                    p.user?.firstName ||
                    p.user?.email ||
                    "Unknown";

                  const courseTitle = p.metadata?.title || p.course?.title || "N/A";

                  // Status style
                  const status = p.status || "pending";
                  const statusConfig = {
                    successful: {
                      text: "Success",
                      color: "text-green-400",
                      bg: "bg-green-500/10",
                      icon: <FaCheckCircle className="text-green-400" />,
                    },
                    failed: {
                      text: "Failed",
                      color: "text-red-400",
                      bg: "bg-red-500/10",
                      icon: <FaTimesCircle className="text-red-400" />,
                    },
                    pending: {
                      text: "Pending",
                      color: "text-yellow-300",
                      bg: "bg-yellow-500/10",
                      icon: <FaClock className="text-yellow-300" />,
                    },
                  }[status];

                  return (
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
                      <td className="p-4 rounded-l-xl">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-blue-400 text-sm" />
                          <span className="text-gray-200 whitespace-nowrap">
                            {userName}
                          </span>
                        </div>
                      </td>

                      {/* COURSE */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FaBookOpen className="text-blue-300 text-sm" />
                          <span className="text-gray-300 truncate max-w-[150px]">
                            {courseTitle}
                          </span>
                        </div>
                      </td>

                      {/* AMOUNT */}
                      <td className="p-4 font-semibold">
                        <div className="flex items-center gap-1 text-green-400">
                          <FaRupeeSign />
                          {p.amount}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="p-4">
                        <div
                          className={`
                            flex items-center gap-2 px-3 py-1 text-xs font-semibold
                            rounded-full w-fit ${statusConfig.bg} ${statusConfig.color}
                          `}
                        >
                          {statusConfig.icon}
                          {statusConfig.text}
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="p-4 text-right text-gray-400 rounded-r-xl whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
