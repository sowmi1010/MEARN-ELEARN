import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function QuizPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  const timerRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(600);

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Load all questions for this quiz set
  useEffect(() => {
    loadAllQuestions();
  }, [id]);

  async function loadAllQuestions() {
    setLoading(true);
    try {
      const res = await api.get(`/quizzes/${id}`, { headers });
      const base = res.data;

      const all = await api.get("/quizzes", {
        headers,
        params: {
          subject: base.subject,
          lesson: base.lesson,
        },
      });

      setQuestions(all.data);
      setAnswers(Array(all.data.length).fill(null));
    } catch (err) {
      console.error("Quiz load error:", err);
    }
    setLoading(false);
  }

  // Timer
  useEffect(() => {
    if (questions.length === 0) return;

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
  }, [questions]);

  const selectOption = (index) => {
    const cp = [...answers];
    cp[current] = index;
    setAnswers(cp);
  };

  const next = () => {
    if (current + 1 < questions.length) setCurrent(current + 1);
    else finishQuiz();
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const finishQuiz = () => {
    let score = 0;
    const details = [];

    questions.forEach((q, i) => {
      const chosen = answers[i];
      const correct = q.correctAnswerIndex;
      if (chosen === correct) score++;

      details.push({
        question: q.question,
        chosen,
        correct,
        options: q.options,
      });
    });

    navigate("/student/quiz/result", {
      state: { score, total: questions.length, details },
    });
  };

  const format = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading || questions.length === 0)
    return (
      <div className="p-10 text-center text-gray-300 text-xl">
        Loading your quiz…
      </div>
    );

  const q = questions[current];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0b0f17] text-gray-100 flex flex-col">

      {/* TOP TIMER BAR */}
      <div className="h-2 bg-gray-800 relative">
        <div
          className="h-full bg-purple-600 transition-all"
          style={{
            width: `${((questions.length - current) / questions.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur border-b border-gray-800">
        <div>
          <div className="text-lg font-bold">{q.subject}</div>
          <div className="text-sm text-gray-400">{q.lesson}</div>
        </div>
        <div className="text-xl font-mono text-purple-300">{format(timeLeft)}</div>
      </div>

      {/* QUESTION CARD */}
      <div className="flex-1 px-6 py-10 flex justify-center">
        <div className="w-full max-w-3xl bg-[#0e1320]/60 backdrop-blur-xl border border-purple-700/20 rounded-2xl p-8 shadow-2xl">

          {/* QUESTION */}
          <h2 className="text-2xl font-bold mb-8 leading-relaxed">
            <span className="text-purple-400 mr-2">Q{current + 1}.</span>
            {q.question}
          </h2>

          {/* OPTIONS */}
          <div className="space-y-4">
            {q.options.map((opt, i) => {
              const selected = answers[current] === i;
              return (
                <button
                  key={i}
                  onClick={() => selectOption(i)}
                  className={`
                    w-full p-4 rounded-xl flex gap-4 transition-all 
                    ${selected
                      ? "bg-purple-600 text-white scale-[1.02] shadow-xl"
                      : "bg-white/5 text-gray-300 hover:bg-white/10"}
                  `}
                >
                  <div
                    className={`
                      w-10 h-10 rounded-full flex justify-center items-center font-semibold
                      ${selected ? "bg-white text-black" : "bg-white/10"}
                    `}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-lg">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="flex justify-between items-center mt-10">

            <button
              onClick={prev}
              disabled={current === 0}
              className="px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40"
            >
              ← Previous
            </button>

            <button
              onClick={next}
              className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 font-semibold shadow-lg"
            >
              {current + 1 === questions.length ? "Finish Quiz" : "Next →"}
            </button>

          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-4 text-center text-gray-400">
        Question {current + 1} of {questions.length}
      </footer>
    </div>
  );
}
