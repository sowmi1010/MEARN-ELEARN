import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";
import { FaArrowLeft, FaQuestionCircle, FaCheckCircle } from "react-icons/fa";

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
        console.error("Failed to fetch quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#050813] text-white">
        Loading Quiz...
      </div>
    );

  if (!quiz)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#050813] text-red-400">
        Quiz not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050813] text-white px-6 py-10">

      {/* MAIN CARD */}
      <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

        {/* TITLE */}
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
          <FaQuestionCircle className="text-pink-400" />
          Quiz Preview
        </h1>

        {/* QUESTION */}
        <div className="bg-black/50 p-5 rounded-xl border border-white/10 mb-6">
          <p className="text-sm text-gray-400 mb-1">Question</p>
          <h2 className="text-xl font-semibold">{quiz.question}</h2>
        </div>

        {/* OPTIONS */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {quiz.options?.map((opt, index) => {
            const isCorrect = index === Number(quiz.correctAnswerIndex);

            return (
              <div
                key={index}
                className={`p-4 rounded-xl border flex gap-3 items-center
                ${
                  isCorrect
                    ? "bg-green-500/10 border-green-400"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <span className="font-bold text-sm">
                  {String.fromCharCode(65 + index)}.
                </span>

                <span className="flex-1">{opt}</span>

                {isCorrect && <FaCheckCircle className="text-green-400" />}
              </div>
            );
          })}
        </div>

        {/* DETAILS */}
        <div className="grid md:grid-cols-3 gap-6 bg-black/40 p-6 rounded-xl border border-white/10">
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

/* ✅ Info box */
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-semibold">{value || "-"}</p>
  </div>
);
