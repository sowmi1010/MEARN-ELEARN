// src/pages/student/Quiz.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function Quiz() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ subject: "", lesson: "", search: "" });

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    loadQuizzes();
    // eslint-disable-next-line
  }, []);

  async function loadQuizzes() {
    setLoading(true);
    try {
      const res = await api.get("/quizzes", { headers });
      setQuizzes(res.data || []);
    } catch (err) {
      console.error("Failed to load quizzes", err);
    } finally {
      setLoading(false);
    }
  }

  const applyFilters = () => {
    // client-side filter (server filtering could be added)
    loadQuizzes(); // re-fetch (if backend supports query params, pass them)
  };

  const startQuiz = (quiz) => {
    // navigate to player and pass quiz id
    navigate(`/student/quiz/play/${quiz._id}`);
  };

  return (
    <main className="p-6 min-h-screen bg-[#0b0f1a] text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-purple-400">Quiz</h1>
      </div>

      <div className="bg-[#081024] p-4 rounded-xl mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="bg-[#0d1325] p-3 rounded border border-purple-700"
          placeholder="Search..."
        />
        <input
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          className="bg-[#0d1325] p-3 rounded border border-purple-700"
          placeholder="Subject"
        />
        <input
          value={filters.lesson}
          onChange={(e) => setFilters({ ...filters, lesson: e.target.value })}
          className="bg-[#0d1325] p-3 rounded border border-purple-700"
          placeholder="Lesson"
        />
        <button
          onClick={applyFilters}
          className="py-2 px-4 bg-purple-600 rounded hover:bg-purple-700"
        >
          Apply Filters
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400">Loading quizzes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes
            .filter((q) => {
              const s = filters.search.trim().toLowerCase();
              const subjectOk = !filters.subject || (q.subject || "").toLowerCase().includes(filters.subject.toLowerCase());
              const lessonOk = !filters.lesson || (q.lesson || "").toLowerCase().includes(filters.lesson.toLowerCase());
              const searchOk = !s || (q.question || "").toLowerCase().includes(s) || (q.subject || "").toLowerCase().includes(s);
              return subjectOk && lessonOk && searchOk;
            })
            .map((quiz) => (
              <div key={quiz._id} className="bg-[#081024] rounded-xl p-4 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-purple-300 mb-2">{quiz.subject} {quiz.lesson ? `• ${quiz.lesson}` : ""}</h3>
                    <p className="text-gray-400 mb-4">Question preview: {quiz.question.length > 90 ? quiz.question.slice(0, 90) + "..." : quiz.question}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startQuiz(quiz)}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                      >
                        Start Quiz
                      </button>
                      <button
                        onClick={() => navigate(`/student/quiz/play/${quiz._id}?preview=true`)}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-800 to-indigo-700 rounded flex items-center justify-center text-white text-2xl font-bold">
                    Q
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
      {(!loading && quizzes.length === 0) && <p className="mt-8 text-gray-500">No quizzes found.</p>}
    </main>
  );
}
