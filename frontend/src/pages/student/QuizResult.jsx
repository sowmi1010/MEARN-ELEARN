// src/pages/student/QuizResult.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) {
    return (
      <div className="p-6 text-gray-200">
        <p>No result to show. Please take a quiz first.</p>
        <button className="mt-4 bg-purple-600 px-4 py-2 rounded" onClick={() => navigate("/student/quiz")}>
          Back to Quizzes
        </button>
      </div>
    );
  }

  const { score, total, details = [] } = state;
  const percent = Math.round((score / total) * 100);

  return (
    <div className="p-6 min-h-screen bg-[#0b0f1a] text-gray-100">
      <div className="max-w-3xl mx-auto bg-[#081024] p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-extrabold text-purple-400 mb-4">Quiz Result</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-black/30 rounded">
            <div className="text-sm text-gray-400">Score</div>
            <div className="text-2xl font-bold">{score}/{total}</div>
          </div>
          <div className="p-4 bg-black/30 rounded">
            <div className="text-sm text-gray-400">Percentage</div>
            <div className="text-2xl font-bold">{percent}%</div>
          </div>
          <div className="p-4 bg-black/30 rounded">
            <div className="text-sm text-gray-400">Status</div>
            <div className="text-2xl font-bold">{percent >= 50 ? "Passed" : "Review"}</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Answers</h3>
          <ul className="space-y-3">
            {details.map((d, idx) => {
              const correct = d.correctIndex;
              const chosen = d.chosen;
              return (
                <li key={idx} className="p-3 rounded bg-[#0a1220]">
                  <div className="font-semibold">{idx + 1}. {d.question}</div>
                  <div className="mt-2 text-sm">
                    Your answer: <span className={`font-medium ${chosen === correct ? "text-green-400" : "text-red-400"}`}>
                      {chosen == null ? "Not answered" : `${String.fromCharCode(65 + chosen)}. ${d.options[chosen]}`}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-400">
                    Correct: {String.fromCharCode(65 + correct)}. {d.options[correct]}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-6 flex gap-4">
          <button onClick={() => navigate("/student/quiz")} className="bg-purple-600 px-4 py-2 rounded">Back to Quizzes</button>
          <button onClick={() => window.location.reload()} className="bg-green-600 px-4 py-2 rounded">Retake</button>
        </div>
      </div>
    </div>
  );
}
