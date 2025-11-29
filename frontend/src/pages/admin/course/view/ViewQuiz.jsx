import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";
import {
  FaArrowLeft,
  FaQuestionCircle,
  FaCheckCircle,
} from "react-icons/fa";

export default function ViewQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data);
      } catch (err) {
        console.error("Failed to load quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#020617] text-cyan-400 text-xl">
        Loading Quiz...
      </div>
    );

  if (!quiz)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#020617] text-red-400 text-xl">
        Quiz not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a1124] to-[#1e293b] text-white px-6 py-10">
      {/* CARD */}
      <div className="
        max-w-5xl mx-auto 
        bg-white/5 backdrop-blur-xl 
        border border-white/10 rounded-3xl 
        p-10 shadow-2xl shadow-cyan-900/30
      ">

        {/* TITLE */}
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-8 text-pink-400 drop-shadow">
          <FaQuestionCircle />
          Quiz Preview
        </h1>

        {/* QUESTION */}
        <div className="bg-black/40 p-6 rounded-xl border border-white/10 shadow">
          <p className="text-gray-400 text-sm">Question</p>
          <h2 className="text-2xl font-semibold mt-1 leading-relaxed">
            {quiz.question}
          </h2>
        </div>

        {/* OPTIONS */}
        <div className="grid md:grid-cols-2 gap-5 mt-8">
          {quiz.options?.map((opt, index) => {
            const isCorrect = index === Number(quiz.correctAnswerIndex);

            return (
              <div
                key={index}
                className={`
                  p-4 rounded-xl flex items-center gap-3 border 
                  transition
                  ${
                    isCorrect
                      ? "bg-green-500/20 border-green-400 shadow-md shadow-green-800/40"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }
                `}
              >
                <span className="text-sm font-bold opacity-80">
                  {String.fromCharCode(65 + index)}.
                </span>

                <span className="flex-1">{opt}</span>

                {isCorrect && (
                  <FaCheckCircle className="text-green-400 text-xl" />
                )}
              </div>
            );
          })}
        </div>

        {/* DETAILS */}
        <div className="grid md:grid-cols-3 gap-6 mt-10 bg-black/40 p-6 rounded-xl border border-white/10 shadow">
          <Info label="Group" value={quiz.group} />
          <Info label="Standard" value={quiz.standard} />
          <Info label="Board" value={quiz.board} />
          <Info label="Language" value={quiz.language} />
          <Info label="Subject" value={quiz.subject} />
          <Info label="Lesson" value={quiz.lesson} />
        </div>
      </div>
    </div>
  );
}

/* REUSABLE INFO BOX */
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    <p className="text-[15px] font-semibold text-cyan-300 mt-1">
      {value || "-"}
    </p>
  </div>
);
