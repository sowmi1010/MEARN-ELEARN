// src/pages/student/QuizResult.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function QuizResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!state) {
    return (
      <div className="p-6 text-gray-200 min-h-screen bg-[#0b0f1a]">
        <p>No result to show. Please take a quiz first.</p>
        <button
          className="mt-4 bg-purple-600 px-4 py-2 rounded"
          onClick={() => navigate("/student/quiz")}
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const { score, total, details = [] } = state;
  const percent = Math.round((score / total) * 100);
  const passed = percent >= 50;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0c0f1a] text-gray-100 p-6">

      {/* TOP HEADER */}
      <h1 className="text-4xl font-extrabold text-purple-400 text-center mb-10">
        Your Quiz Performance
      </h1>

      {/* SCORE CARD */}
      <div className="max-w-4xl mx-auto bg-[#0d1222]/70 backdrop-blur-xl border border-purple-800/30
                      rounded-2xl p-10 shadow-2xl mb-12">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          {/* Animated Circular Score */}
          <div className="relative w-40 h-40">
            <svg className="absolute inset-0 w-full h-full">
              <circle
                cx="50%"
                cy="50%"
                r="70"
                stroke="#1f2538"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="50%"
                cy="50%"
                r="70"
                stroke={passed ? "#4ade80" : "#f87171"}
                strokeWidth="12"
                fill="none"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * percent) / 100}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold">{percent}%</span>
              <span className="text-xs text-gray-400">Score</span>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-purple-300 mb-2">
              {passed ? "Great Job! 🎉" : "Keep Practicing 💪"}
            </h2>

            <p className="text-lg text-gray-300 mb-3">
              You answered <span className="font-bold">{score}</span> out of{" "}
              <span className="font-bold">{total}</span> correctly.
            </p>

            <div className="flex gap-4 mt-5 justify-center md:justify-start">
              <button
                onClick={() => navigate("/student/quiz")}
                className="bg-purple-600 px-5 py-2 rounded-lg hover:bg-purple-700 shadow-md"
              >
                Back to Quizzes
              </button>

              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 px-5 py-2 rounded-lg hover:bg-green-700 shadow-md"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ANSWER REVIEW */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-purple-300">
          Answer Review
        </h2>

        <div className="space-y-6">
          {details.map((d, index) => {
            const chosen = d.chosen;
            const correct = d.correct;

            return (
              <div
                key={index}
                className="bg-[#0f1525]/60 border border-purple-800/20 rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold mb-4">
                  {index + 1}. {d.question}
                </h3>

                {/* OPTIONS LIST */}
                <div className="space-y-3">
                  {d.options.map((opt, i) => {
                    const isCorrect = i === correct;
                    const isChosen = i === chosen;

                    return (
                      <div
                        key={i}
                        className={`p-4 rounded-lg border transition-all
                          ${isCorrect ? "border-green-500/60 bg-green-600/20" : ""}
                          ${isChosen && !isCorrect ? "border-red-500/60 bg-red-600/20" : ""}
                          ${!isCorrect && !isChosen ? "border-gray-700 bg-white/5" : ""}
                        `}
                      >
                        <span className="font-bold mr-3">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {opt}
                      </div>
                    );
                  })}
                </div>

                {/* STATUS */}
                <div className="mt-4 text-sm">
                  {chosen === correct ? (
                    <span className="text-green-400 font-semibold">✔ Correct</span>
                  ) : (
                    <span className="text-red-400 font-semibold">✘ Incorrect</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        Review your answers and try again to improve your score.
      </footer>
    </div>
  );
}
