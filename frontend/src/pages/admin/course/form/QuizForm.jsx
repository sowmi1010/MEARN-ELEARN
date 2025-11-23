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

  /* ✅ Load quiz in EDIT */
  useEffect(() => {
    if (!id) return;

    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        const q = res.data;

        setFormData({
          group: q.group || "",
          standard: q.standard || "",
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

  /* ✅ Handle Input */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "group") {
      setFormData({
        ...formData,
        group: value,
        standard: "",
        subject: "",
        lesson: "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* ✅ Handle Options */
  const handleOptionChange = (index, value) => {
    const updated = [...formData.options];
    updated[index] = value;
    setFormData({ ...formData, options: updated });
  };

  /* ✅ Submit */
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
    <div className="p-10 bg-gradient-to-b from-[#0b1120] via-[#0f172a] to-[#1e293b] text-white min-h-screen">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-10 flex justify-center items-center gap-2 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
        <FaQuestionCircle />
        {isEdit ? "Edit Quiz" : "Add New Quiz"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/90 max-w-6xl mx-auto rounded-2xl p-10 space-y-6 border border-gray-800"
      >
        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Dropdown
            label="Group"
            name="group"
            value={formData.group}
            options={groupOptions}
            onChange={handleChange}
            required
          />

          <Dropdown
            label="Standard"
            name="standard"
            value={formData.standard}
            options={standardOptions[formData.group] || []}
            onChange={handleChange}
            required
          />

          <Dropdown
            label="Board"
            name="board"
            value={formData.board}
            options={boardOptions}
            onChange={handleChange}
            required
          />

          <Dropdown
            label="Language"
            name="language"
            value={formData.language}
            options={languageOptions}
            onChange={handleChange}
            required
          />
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Dropdown
            label="Subject"
            name="subject"
            value={formData.subject}
            options={subjectMap[formData.group] || []}
            onChange={handleChange}
            required
          />

          <Dropdown
            label="Lesson"
            name="lesson"
            value={formData.lesson}
            options={lessonOptions}
            onChange={handleChange}
            required
          />
        </div>

        {/* QUESTION */}
        <textarea
          name="question"
          value={formData.question}
          onChange={handleChange}
          rows="3"
          placeholder="Enter quiz question..."
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          required
        />

        {/* OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700"
              required
            />
          ))}
        </div>

        {/* CORRECT ANSWER */}
        <select
          name="correctAnswerIndex"
          value={formData.correctAnswerIndex}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
        >
          <option value="">Select Correct Answer</option>
          <option value="0">Option A</option>
          <option value="1">Option B</option>
          <option value="2">Option C</option>
          <option value="3">Option D</option>
        </select>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 py-3 rounded-lg font-bold flex justify-center items-center gap-2"
        >
          <FaSave />
          {loading ? "Saving..." : isEdit ? "Update Quiz" : "Save Quiz"}
        </button>

        {message && (
          <p className="text-center mt-4 text-green-400">{message}</p>
        )}
      </form>
    </div>
  );
}
