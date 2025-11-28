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
    <div className="p-10 bg-[#020617] text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-10 flex justify-center items-center gap-2 text-pink-400">
        <FaQuestionCircle />
        {isEdit ? "Edit Quiz" : "Add New Quiz"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 max-w-6xl mx-auto rounded-2xl p-10 space-y-6 border border-gray-800"
      >
        {/* ROW 1 */}
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

        {/* ROW 2 */}
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

        {/* QUESTION */}
        <textarea
          name="question"
          value={formData.question}
          onChange={handleChange}
          rows="3"
          placeholder="Enter quiz question..."
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
        />

        {/* OPTIONS */}
        <div className="grid md:grid-cols-2 gap-4">
          {formData.options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700"
            />
          ))}
        </div>

        {/* CORRECT ANSWER */}
        <select
          name="correctAnswerIndex"
          value={formData.correctAnswerIndex}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
        >
          <option value="">Select Correct Answer</option>
          <option value="0">Option A</option>
          <option value="1">Option B</option>
          <option value="2">Option C</option>
          <option value="3">Option D</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 py-3 rounded-lg font-bold"
        >
        
          {loading ? "Saving..." : isEdit ? "Update Quiz" : "Save Quiz"}
        </button>

        {message && (
          <p className="text-center mt-4 text-green-400">{message}</p>
        )}
      </form>
    </div>
  );
}
