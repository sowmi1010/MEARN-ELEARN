import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [completed, setCompleted] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const loadTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await api.get("/todos", { headers });

      setTodos(res.data.todos);
      setCompleted(res.data.completed);
      setRemaining(res.data.remaining);
    } catch (err) {
      console.error("Load Todos Error:", err);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const toggleTodo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await api.put(`/todos/toggle/${id}`, {}, { headers });
      loadTodos();
    } catch (err) {
      console.error("Toggle Error:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await api.delete(`/todos/${id}`, { headers });
      loadTodos();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // Progress %
  const percent = todos.length
    ? Math.round((completed / todos.length) * 100)
    : 0;

  const getDueBadge = (date, month, year) => {
    const today = new Date();
    const d = new Date(`${month} ${date}, ${year}`);

    if (d.toDateString() === today.toDateString())
      return <span className="text-xs px-2 py-1 bg-blue-600/40 rounded">Today</span>;

    if (d < today)
      return <span className="text-xs px-2 py-1 bg-red-600/40 rounded">Overdue</span>;

    return <span className="text-xs px-2 py-1 bg-purple-600/40 rounded">Upcoming</span>;
  };

  return (
    <div className="min-h-screen bg-[#060912] text-white p-8">

      {/* TOP HEADER with Circle Progress */}
      <div className="flex flex-wrap items-center gap-6 mb-10">

        {/* Progress Circle */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="#1e293b"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="#7c3aed"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 58}
              strokeDashoffset={
                2 * Math.PI * 58 - (percent / 100) * (2 * Math.PI * 58)
              }
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute text-xl font-bold">{percent}%</div>
        </div>

        <div className="flex-1">
          <div className="flex gap-4 mb-4">
            <div className="bg-purple-900/40 px-6 py-4 rounded-xl shadow border border-purple-700/30">
              <div className="text-gray-300 text-sm">Completed</div>
              <div className="text-3xl font-bold text-purple-300">{completed}</div>
            </div>

            <div className="bg-blue-900/40 px-6 py-4 rounded-xl shadow border border-blue-700/30">
              <div className="text-gray-300 text-sm">Remaining</div>
              <div className="text-3xl font-bold text-blue-300">{remaining}</div>
            </div>
          </div>

          <Link
            to="/student/todo/add"
            className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl shadow-md font-semibold inline-block"
          >
            + Add New Task
          </Link>
        </div>
      </div>

      {/* TODO LIST */}
      <div className="bg-[#0d1220] border border-purple-700/20 rounded-2xl shadow-xl p-6">

        {todos.length === 0 && (
          <div className="text-center text-gray-400 p-6">No tasks created yet.</div>
        )}

        {todos.map((item) => (
          <div
            key={item._id}
            className="group relative flex items-center justify-between p-5 bg-[#121a31] rounded-xl mb-4 border border-transparent hover:border-purple-700/40 transition shadow hover:shadow-purple-700/10"
          >
            {/* LEFT SIDE */}
            <div className="flex items-start gap-4">

              {/* Checkbox */}
              <div
                onClick={() => toggleTodo(item._id)}
                className={`w-7 h-7 rounded-md cursor-pointer flex items-center justify-center transition
                  ${item.completed ? "bg-green-500 shadow-green-500/40 shadow-xl" : "bg-gray-700 hover:bg-gray-600"}
                `}
              >
                {item.completed && (
                  <span className="text-black font-bold text-lg">✔</span>
                )}
              </div>

              <div>
                <p className={`text-lg ${item.completed ? "line-through text-gray-500" : "text-gray-200"}`}>
                  {item.text}
                </p>

                <div className="mt-2">
                  {getDueBadge(item.date, item.month, item.year)}
                </div>
              </div>
            </div>

            {/* DELETE BUTTON */}
            <button
              onClick={() => deleteTodo(item._id)}
              className="text-red-400 hover:text-red-500 text-xl opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
