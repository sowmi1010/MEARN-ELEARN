import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../utils/api";
import Dropdown from "../../../../components/common/Dropdown";

import {
  groupOptions,
  standardOptions,
  boardOptions,
  languageOptions,
  subjectMap,
  lessonOptions,
} from "../../../../utils/courseOptions";

import { FaQuestionCircle, FaSave } from "react-icons/fa";

export default function QuizForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    group: "",
    standard: "",
    groupCode: "", // ✅ NEW
    board: "",
    language: "",
    subject: "",
    lesson: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswerIndex: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ✅ LOAD QUIZ (EDIT) */
  useEffect(() => {
    if (!id) return;

    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        const q = res.data;

        setFormData({
          group: q.group || "",
          standard: q.standard || "",
          groupCode: q.groupCode || "",
          board: q.board || "",
          language: q.language || "",
          subject: q.subject || "",
          lesson: q.lesson || "",
          question: q.question || "",
          options: q.options || ["", "", "", ""],
          correctAnswerIndex: q.correctAnswerIndex?.toString() || "",
        });
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchQuiz();
  }, [id]);

  /* ============================
         INPUT HANDLER
  ============================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "group") {
      setFormData({
        ...formData,
        group: value,
        standard: "",
        groupCode: "",
        subject: "",
        lesson: "",
      });
    } else if (name === "standard") {
      setFormData({
        ...formData,
        standard: value,
        subject: "",
      });
    } else if (name === "groupCode") {
      setFormData({
        ...formData,
        groupCode: value,
        subject: "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* ============================
       SMART SUBJECTS LOADER
  ============================= */
  const getSubjects = () => {
    const { group, standard, groupCode } = formData;

    if (!group) return [];

    // ROOT / STEM / FLOWER / FRUIT / SEED
    if (group !== "LEAF") {
      return subjectMap[group] || [];
    }

    if (!standard) return [];

    // 9th & 10th
    if (standard === "9th" || standard === "10th") {
      return subjectMap.LEAF[standard] || [];
    }

    // 11th & 12th (BIO / COMPUTER / COMMERCE)
    if ((standard === "11th" || standard === "12th") && groupCode) {
      const key = `${standard}-${groupCode.toUpperCase()}`;
      return subjectMap.LEAF[key] || [];
    }

    return [];
  };

  /* ============================
         OPTIONS HANDLER
  ============================= */
  const handleOptionChange = (index, value) => {
    const updated = [...formData.options];
    updated[index] = value;
    setFormData({ ...formData, options: updated });
  };

  /* ============================
         SUBMIT
  ============================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        correctAnswerIndex: Number(formData.correctAnswerIndex),
      };

      if (isEdit) {
        await api.put(`/quizzes/${id}`, payload);
        setMessage("✅ Quiz updated successfully");
      } else {
        await api.post(`/quizzes/upload`, payload);
        setMessage("✅ Quiz added successfully");
      }

      setTimeout(() => navigate("/admin/courses"), 1200);
    } catch (err) {
      console.error("Save Error:", err);
      setMessage("❌ Failed to save quiz");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a1025] to-[#111827] text-white px-6 py-10">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex flex-col items-center mb-10">
        <div className="flex items-center gap-4">
          <FaQuestionCircle className="text-4xl text-pink-400 drop-shadow-lg" />

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent tracking-wide">
            {isEdit ? "Edit Quiz" : "Create New Quiz"}
          </h1>
        </div>

        <p className="text-gray-400 mt-2 text-sm">
          Add your MCQ question with options & correct answer.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="
        max-w-5xl mx-auto
        bg-[#0f172a]/70
        backdrop-blur-xl
        rounded-3xl
        border border-white/10
        shadow-2xl shadow-pink-900/20
        p-10
        space-y-10
      "
      >
        {/* ========================== */}
        {/*        BASIC DROPDOWNS     */}
        {/* ========================== */}
        <div className="grid md:grid-cols-5 gap-6">
          <Dropdown
            label="Group"
            name="group"
            value={formData.group}
            options={groupOptions}
            onChange={handleChange}
          />

          <Dropdown
            label="Standard"
            name="standard"
            value={formData.standard}
            options={standardOptions[formData.group] || []}
            onChange={handleChange}
          />

          {(formData.standard === "11th" || formData.standard === "12th") && (
            <Dropdown
              label="Group Code"
              name="groupCode"
              value={formData.groupCode}
              options={["BIO MATHS", "COMPUTER", "COMMERCE"]}
              onChange={handleChange}
            />
          )}

          <Dropdown
            label="Board"
            name="board"
            value={formData.board}
            options={boardOptions}
            onChange={handleChange}
          />

          <Dropdown
            label="Language"
            name="language"
            value={formData.language}
            options={languageOptions}
            onChange={handleChange}
          />
        </div>

        {/* ========================== */}
        {/*       SUBJECT / LESSON     */}
        {/* ========================== */}
        <div className="grid md:grid-cols-2 gap-6">
          <Dropdown
            label="Subject"
            name="subject"
            value={formData.subject}
            options={getSubjects()}
            onChange={handleChange}
          />

          <Dropdown
            label="Lesson"
            name="lesson"
            value={formData.lesson}
            options={lessonOptions}
            onChange={handleChange}
          />
        </div>

        {/* ========================== */}
        {/*         QUESTION FIELD     */}
        {/* ========================== */}
        <div>
          <p className="text-sm text-gray-300 mb-2">Quiz Question</p>

          <textarea
            name="question"
            value={formData.question}
            onChange={handleChange}
            rows="4"
            placeholder="Enter your quiz question here..."
            className="
            w-full p-4 rounded-xl
            bg-[#111827]/70 
            border border-white/10
            focus:border-pink-500
            focus:outline-none
            transition
          "
          ></textarea>
        </div>

        {/* ========================== */}
        {/*          OPTIONS           */}
        {/* ========================== */}
        <p className="text-sm text-gray-300 font-medium">Options</p>

        <div className="grid md:grid-cols-2 gap-4">
          {formData.options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
              className="
              p-4 rounded-xl 
              bg-[#111827]/70 
              border border-white/10
              focus:border-pink-500
              focus:outline-none
              transition
            "
            />
          ))}
        </div>

        {/* ========================== */}
        {/*    CORRECT ANSWER SELECT   */}
        {/* ========================== */}
        <div>
          <p className="text-sm text-gray-300 mb-2">Correct Answer</p>

          <select
            name="correctAnswerIndex"
            value={formData.correctAnswerIndex}
            onChange={handleChange}
            className="
            w-full p-4 rounded-xl
            bg-[#111827]/70 
            border border-white/10
            focus:border-pink-500
            focus:outline-none
            transition
          "
          >
            <option value="">Select Correct Answer</option>
            <option value="0">Option A</option>
            <option value="1">Option B</option>
            <option value="2">Option C</option>
            <option value="3">Option D</option>
          </select>
        </div>

        {/* ========================== */}
        {/*       SUBMIT BUTTON        */}
        {/* ========================== */}
        <button
          type="submit"
          disabled={loading}
          className="
          w-full py-4 rounded-xl
          flex items-center justify-center gap-3
          text-lg font-semibold
          bg-gradient-to-r from-pink-600 to-purple-600
          hover:brightness-110 transition 
          shadow-lg shadow-pink-700/30
        "
        >
          <FaSave />
          {loading ? "Saving..." : isEdit ? "Update Quiz" : "Save Quiz"}
        </button>

        {message && (
          <p className="text-center text-green-400 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}
