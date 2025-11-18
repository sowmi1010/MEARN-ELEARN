// src/pages/student/QuizPlayer.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/api";

export default function QuizPlayer() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const preview = searchParams.get("preview") === "true";

  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]); // store chosen indices
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const timerRef = useRef(null);

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    loadQuiz();
    // eslint-disable-next-line
  }, [id]);

  async function loadQuiz() {
    try {
      const res = await api.get(`/quizzes/${id}`, { headers });
      setQuiz(res.data);
      // default time: 20 seconds per question as example — adjust as needed
      setTimeLeft((res.data?.length || 1) * 20); // if we had total questions, fallback
      // if single-question quiz, treat differently
      setAnswers(Array(res.data ? 1 : 0).fill(null)); // placeholder but below we will set properly
      // for quizzes that are stored as one-per-doc (question per doc), we will adapt below
    } catch (err) {
      console.error("Failed to load quiz", err);
    }
  }

  // If your schema stores a single question per document, but you want a multi-question test,
  // you'll need a route that returns many quiz docs as test. Here we assume one doc = one question,
  // but your DB likely has many quiz docs and Admin assembles a test. For now, if res.data is a single quiz,
  // we will treat test length = 1 (or you can fetch list by query if backend returns array).
  // To support full tests, you can change backend to return an array for /tests/:id or pass testId.

  // If quiz.options is available and quiz is single-question test:
  useEffect(() => {
    if (!quiz) return;
    // For single-question doc, we just set single-slot answers
    setAnswers([null]);
    setCurrent(0);
    // Start timer (example: 120 secs)
    setTimeLeft(120);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          finishQuiz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [quiz]);

  const selectOption = (index) => {
    setSelected(index);
    const copy = [...answers];
    copy[current] = index;
    setAnswers(copy);
  };

  const nextQuestion = () => {
    // move to next if any; if only single question then finish
    // For single-question doc: finish
    finishQuiz();
  };

  const finishQuiz = () => {
    // compute score for single-question doc
    if (!quiz) return;
    const correctIndex = quiz.correctAnswerIndex;
    const chosen = answers[0];
    const score = chosen === correctIndex ? 1 : 0;
    const total = 1;
    navigate("/student/quiz/result", {
      state: { score, total, details: [{ question: quiz.question, chosen, correctIndex, options: quiz.options }] },
    });
  };

  // small helper to format timer mm:ss
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!quiz) return <div className="p-6 text-gray-200">Loading quiz...</div>;

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 px-3 py-1 rounded text-sm">1</div>
          <div className="text-lg font-semibold">{quiz.subject}</div>
          <div className="text-sm text-gray-400">{quiz.lesson || ""}</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/5 px-3 py-2 rounded text-sm">{formatTime(timeLeft)}</div>
          <button onClick={() => navigate(-1)} className="text-white/80 hover:text-white">Close ✕</button>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="mb-6">
            <h2 className="text-xl text-gray-300 text-center">{quiz.question}</h2>
          </div>

          <div className="space-y-4">
            {quiz.options.map((opt, i) => {
              const isSelected = answers[0] === i;
              return (
                <button
                  key={i}
                  onClick={() => selectOption(i)}
                  className={`w-full text-left p-4 rounded shadow-md flex items-center gap-4 ${
                    isSelected ? "bg-white text-black" : "bg-white/5 text-gray-100 hover:bg-white/10"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div>{opt}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer - progress / next */}
      <div className="bg-[#0b0d10] p-4 border-t border-gray-800 flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="h-3 bg-white/10 rounded overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${(answers.filter(a => a !== null).length / (1 || 1)) * 100}%` }}
            />
          </div>
          <div className="text-sm text-gray-400 mt-2">
            {answers.filter(a => a !== null).length}/{1}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={nextQuestion}
            disabled={answers[0] === null && !preview}
            className="bg-green-600 px-6 py-2 rounded text-white disabled:opacity-50"
          >
            {preview ? "Close Preview" : "Finish"}
          </button>
        </div>
      </div>
    </div>
  );
}
