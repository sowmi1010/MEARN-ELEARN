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
    <div className="min-h-screen bg-gradient-to-b from-[#05050e] to-[#0c0f1a] text-gray-100 p-6">

      {/* PAGE TITLE */}
      <h1 className="text-4xl font-extrabold text-purple-400 text-center mb-12 drop-shadow-lg">
        Quiz Results
      </h1>

      {/* ========= SCORE CARD ========= */}
      <div className="
        max-w-4xl mx-auto
        bg-[#0d1222]/80 backdrop-blur-xl
        border border-purple-800/40
        rounded-2xl p-10 shadow-2xl mb-14
      ">

        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          {/* --- SCORE RING --- */}
          <div className="relative w-44 h-44">
            <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
              {/* Background ring */}
              <circle
                cx="50%"
                cy="50%"
                r="70"
                stroke="#1f2538"
                strokeWidth="12"
                fill="none"
              />

              {/* Animated foreground ring */}
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
                className="transition-[stroke-dashoffset] duration-[1200ms] ease-out"
              />
            </svg>

            {/* Score text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold">{percent}%</span>
              <span className="text-sm text-gray-400">Performance</span>
            </div>
          </div>

          {/* --- SUMMARY TEXT --- */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-purple-300 mb-3">
              {passed ? "Excellent Work!" : "Don't Give Up"}
            </h2>

            <p className="text-lg text-gray-300 mb-4">
              You answered <b>{score}</b> out of <b>{total}</b> questions correctly.
            </p>

            <div className="flex gap-4 mt-5 justify-center md:justify-start">
              <button
                onClick={() => navigate("/student/quiz")}
                className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg shadow-md"
              >
                Back to Quizzes
              </button>

              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg shadow-md"
              >
                Retake Quiz
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ========= ANSWER REVIEW ========= */}
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
                className="
                  bg-[#0f1525]/60 backdrop-blur-xl 
                  border border-purple-800/20 
                  rounded-xl p-6 shadow-xl
                  hover:border-purple-600/50 transition-all
                "
              >
                {/* Question */}
                <h3 className="text-lg font-semibold mb-4 leading-relaxed">
                  {index + 1}. {d.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {d.options.map((opt, i) => {
                    const isCorrect = i === correct;
                    const isChosen = i === chosen;

                    return (
                      <div
                        key={i}
                        className={`
                          p-4 rounded-xl border transition-all text-sm
                          flex items-start gap-3
                          ${
                            isCorrect
                              ? "border-green-500 bg-green-500/20"
                              : isChosen
                              ? "border-red-500 bg-red-500/20"
                              : "border-gray-700 bg-white/5 hover:bg-white/10"
                          }
                        `}
                      >
                        <span className="font-bold text-purple-300">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Correct / Incorrect */}
                <div className="mt-4 text-sm font-semibold">
                  {chosen === correct ? (
                    <span className="text-green-400">✔ Correct</span>
                  ) : (
                    <span className="text-red-400">✘ Incorrect</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="mt-20 text-center text-gray-500 text-sm">
        Keep practicing to improve your performance.
      </footer>
    </div>
  );
}
