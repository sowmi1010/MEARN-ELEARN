import React, { useState } from "react";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

export default function AddTodo() {
  const navigate = useNavigate();

  const [todo, setTodo] = useState({
    text: "",
    date: "",
    month: "",
    year: "",
  });

  const [error, setError] = useState("");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const years = ["2024", "2025", "2026", "2027"];

  const validate = () => {
    if (!todo.text.trim()) return "Please enter a task.";
    if (!todo.date || !todo.month || !todo.year)
      return "Please select a valid due date.";
    return "";
  };

  const handleSubmit = async () => {
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await api.post("/todos/add", todo, { headers });

      if (res.status === 201) {
        navigate("/student/todo");
      }
    } catch (err) {
      console.error("Add To-Do Error:", err);
      setError("Failed to add task.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05010f] via-[#0a0320] to-[#12062f] text-white p-8 relative overflow-hidden">
      {/* BACKGROUND LIGHTS */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-700/30 blur-[130px] rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/20 blur-[150px] rounded-full"></div>

      {/* HEADER */}
      <div className="relative z-20">
        <h1 className="text-4xl font-extrabold text-purple-400 flex items-center gap-3 mb-6 justify-center">
          <FaCheckCircle className="text-purple-300" />
          Add New Task
        </h1>
      </div>

      {/* FORM CARD */}
      <div className="relative z-20 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto">
        {/* ERROR */}
        {error && (
          <div className="mb-4 bg-red-600/40 border border-red-500/40 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* TASK INPUT */}
        <label className="block text-sm text-purple-300 font-semibold mb-2">
          Task Name
        </label>

        <input
          type="text"
          className="
            w-full p-4 rounded-xl bg-[#12172a] border border-purple-600/30
            focus:ring-2 focus:ring-purple-500 focus:border-transparent
            outline-none transition
            placeholder:text-gray-500
          "
          placeholder="Enter your task..."
          value={todo.text}
          onChange={(e) => setTodo({ ...todo, text: e.target.value })}
        />

        {/* DATE PICKER */}
        <label className="block text-sm text-purple-300 font-semibold mt-6 mb-2 flex items-center gap-2">
          <FaCalendarAlt /> Due Date
        </label>

        <div className="grid grid-cols-3 gap-4">
          {/* DATE */}
          <select
            className="
              p-4 rounded-xl bg-[#12172a] border border-purple-600/30
              focus:ring-2 focus:ring-purple-500 focus:border-transparent
              outline-none transition
            "
            value={todo.date}
            onChange={(e) => setTodo({ ...todo, date: e.target.value })}
          >
            <option value="">Date</option>
            {[...Array(31).keys()].map((d) => (
              <option key={d + 1}>{d + 1}</option>
            ))}
          </select>

          {/* MONTH */}
          <select
            className="
              p-4 rounded-xl bg-[#12172a] border border-purple-600/30
              focus:ring-2 focus:ring-purple-500 focus:border-transparent
              outline-none transition
            "
            value={todo.month}
            onChange={(e) => setTodo({ ...todo, month: e.target.value })}
          >
            <option value="">Month</option>
            {months.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          {/* YEAR */}
          <select
            className="
              p-4 rounded-xl bg-[#12172a] border border-purple-600/30
              focus:ring-2 focus:ring-purple-500 focus:border-transparent
              outline-none transition
            "
            value={todo.year}
            onChange={(e) => setTodo({ ...todo, year: e.target.value })}
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          className="
            w-full mt-10 py-4 rounded-xl text-lg font-semibold
            bg-gradient-to-r from-purple-600 via-pink-600 to-red-600
            hover:scale-[1.03] transition-all shadow-lg shadow-purple-900/40
          "
        >
          ➤ Add Task
        </button>
      </div>
    </div>
  );
}
