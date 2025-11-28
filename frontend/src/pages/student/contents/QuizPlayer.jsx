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

  /* ✅ LOAD QUESTIONS (ONLY ACTIVE SUBJECT + SAME LESSON) */
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

  /* ✅ TIMER */
  useEffect(() => {
    if (questions.length === 0) return;

    setTimeLeft(questions.length * 60); // 1 min per question

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
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");

    const s = (sec % 60)
      .toString()
      .padStart(2, "0");

    return `${m}:${s}`;
  };

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

  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col text-white">

      {/* PROGRESS BAR */}
      <div className="h-2 bg-gray-800">
        <div
          className="h-full bg-purple-600 transition-all"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* HEADER */}
      <div className="flex justify-between px-6 py-4 border-b border-gray-700">
        <div>
          <h2 className="font-bold text-purple-400">{activeSubject}</h2>
          <p className="text-sm text-gray-400">{q.lesson}</p>
        </div>
        <div className="text-lg font-mono text-purple-300">
          {format(timeLeft)}
        </div>
      </div>

      {/* QUESTION */}
      <div className="flex-1 flex justify-center px-6 py-10">
        <div className="max-w-3xl w-full bg-[#111827] p-8 rounded-2xl border border-purple-700/40">

          <h2 className="text-2xl mb-8">
            <span className="text-purple-500 mr-2">
              Q{current + 1}.
            </span>
            {q.question}
          </h2>

          <div className="space-y-4">
            {q.options.map((opt, i) => {
              const selected = answers[current] === i;

              return (
                <button
                  key={i}
                  onClick={() => selectOption(i)}
                  className={`w-full p-4 rounded-xl text-left transition
                    ${selected ? "bg-purple-600" : "bg-white/5 hover:bg-white/10"}
                  `}
                >
                  <b>{String.fromCharCode(65 + i)}.</b> {opt}
                </button>
              );
            })}
          </div>

          {/* CONTROLS */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prev}
              disabled={current === 0}
              className="px-5 py-2 bg-gray-700 rounded disabled:opacity-40"
            >
              ← Previous
            </button>

            <button
              onClick={next}
              className="px-5 py-2 bg-purple-600 rounded"
            >
              {current + 1 === questions.length
                ? "Finish Quiz"
                : "Next →"}
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-400 py-4">
        Question {current + 1} / {questions.length}
      </p>
    </div>
  );
}
