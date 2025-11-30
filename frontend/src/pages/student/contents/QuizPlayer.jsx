import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const activeGroup = localStorage.getItem("activeGroup");
const activeStandard = localStorage.getItem("activeStandard");
const activeBoard = localStorage.getItem("activeBoard");
const activeLanguage = localStorage.getItem("activeLanguage");
const activeSubject = localStorage.getItem("activeSubject");

export default function QuizPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  const timerRef = useRef(null);
  const finishedRef = useRef(false);

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  /* -----------------------------------------------
        LOAD ALL QUIZ QUESTIONS
  ------------------------------------------------ */
  useEffect(() => {
    loadSubjectQuestions();
    return () => clearInterval(timerRef.current);
  }, [id]);

  async function loadSubjectQuestions() {
    setLoading(true);

    try {
      const res = await api.get("/quizzes", {
        headers,
        params: {
          group: activeGroup?.toUpperCase(),
          standard: activeStandard,
          board: activeBoard,
          language: activeLanguage,
          subject: activeSubject,
        },
      });

      const list = Array.isArray(res.data) ? res.data : [];
      const startQuestion = list.find((q) => q._id === id);

      const finalQuestions = startQuestion
        ? list.filter(
            (q) =>
              q.subject === startQuestion.subject &&
              q.lesson === startQuestion.lesson
          )
        : list;

      setQuestions(finalQuestions);
      setAnswers(Array(finalQuestions.length).fill(null));
    } catch (err) {
      console.error("Quiz load error:", err);
      setQuestions([]);
    }

    setLoading(false);
  }

  /* -----------------------------------------------
        TIMER
  ------------------------------------------------ */
  useEffect(() => {
    if (questions.length === 0) return;

    setTimeLeft(questions.length * 60);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          safeFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [questions]);

  const safeFinishQuiz = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    finishQuiz();
  };

  const selectOption = (index) => {
    const cp = [...answers];
    cp[current] = index;
    setAnswers(cp);
  };

  const next = () => {
    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      clearInterval(timerRef.current);
      safeFinishQuiz();
    }
  };

  const prev = () => {
    if (current > 0) setCurrent((prev) => prev - 1);
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
      state: {
        score,
        total: questions.length,
        details,
        subject: activeSubject,
      },
    });
  };

  const format = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  /* -----------------------------------------------
        LOADING / EMPTY STATE
  ------------------------------------------------ */
  if (loading)
    return (
      <div className="p-10 text-center text-gray-300 text-xl">
        Loading {activeSubject} quiz...
      </div>
    );

  if (questions.length === 0)
    return (
      <div className="p-10 text-center text-gray-400">
        ❌ No questions for {activeSubject}
      </div>
    );

  const q = questions[current];

  /* -----------------------------------------------
        UI
  ------------------------------------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05050d] to-[#0b0f1a] flex flex-col text-white">

      {/* PROGRESS BAR */}
      <div className="h-2 bg-black/40">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* HEADER */}
      <div className="
        sticky top-0 z-20 
        flex justify-between items-center
        px-6 py-4 
        bg-[#0d0d18]/70 backdrop-blur-xl
        border-b border-purple-800/40
      ">
        <div>
          <h2 className="font-bold text-purple-400 text-lg">{activeSubject}</h2>
          <p className="text-sm text-gray-400">{q.lesson}</p>
        </div>

        <div className="text-2xl font-mono text-purple-300">
          {format(timeLeft)}
        </div>
      </div>

      {/* QUESTION AREA */}
      <div className="flex-1 flex justify-center px-4 sm:px-6 py-10">
        <div className="
          w-full max-w-3xl
          bg-[#111827]/70 backdrop-blur-xl
          p-8 rounded-2xl
          border border-purple-800/40
          shadow-2xl shadow-black/50
        ">

          {/* QUESTION TEXT */}
          <h2 className="text-2xl mb-8 leading-relaxed font-semibold">
            <span className="text-purple-500 mr-2">
              Q{current + 1}.
            </span>
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
                    w-full p-4 rounded-xl text-left shadow-md transition
                    border 
                    ${
                      selected
                        ? "bg-purple-600 border-purple-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }
                  `}
                >
                  <span className="font-bold mr-2 text-purple-300">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* CONTROLS */}
          <div className="flex justify-between mt-10">
            <button
              onClick={prev}
              disabled={current === 0}
              className="
                px-6 py-2 rounded-lg
                bg-gray-700/60 border border-gray-500/40
                hover:bg-gray-700
                disabled:opacity-40
              "
            >
              ← Previous
            </button>

            <button
              onClick={next}
              className="
                px-6 py-2 rounded-lg
                bg-purple-600 hover:bg-purple-700
                shadow-md shadow-purple-900/40
              "
            >
              {current + 1 === questions.length ? "Finish Quiz" : "Next →"}
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-400 pb-6">
        Question {current + 1} / {questions.length}
      </p>
    </div>
  );
}
