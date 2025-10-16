import React, { useState } from "react";
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

export default function AddQuiz() {
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

  /* Handle Input Changes */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "group") {
      setFormData({
        ...formData,
        group: value,
        standard: "",
        subject: "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* Update Options Dynamically */
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData({ ...formData, options: updatedOptions });
  };

  /* Submit Quiz Form */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        correctAnswerIndex: Number(formData.correctAnswerIndex),
      };

      await api.post("/quizzes/upload", payload);
      setMessage("Quiz added successfully!");

      // Reset form
      setFormData({
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
    } catch (err) {
      console.error(" Upload Error:", err);
      setMessage("Failed to add quiz. Try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  /* UI */
  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">❓ Add Quiz Question</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
      >
        {/* Dropdown Fields */}
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

        {/* Question */}
        <textarea
          name="question"
          placeholder="Enter your question"
          value={formData.question}
          onChange={handleChange}
          required
          rows="2"
          className="p-2 rounded bg-gray-700 border border-gray-600 col-span-2"
        ></textarea>

        {/* Options */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {formData.options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              required
              className="p-2 rounded bg-gray-700 border border-gray-600"
            />
          ))}
        </div>

        {/* Correct Answer */}
        <div className="col-span-2">
          <label className="text-sm mb-1 text-gray-300 block">Correct Answer</label>
          <select
            name="correctAnswerIndex"
            value={formData.correctAnswerIndex}
            onChange={handleChange}
            required
            className="p-2 rounded bg-gray-700 border border-gray-600 w-full"
          >
            <option value="">Select Correct Option</option>
            <option value="0">Option A</option>
            <option value="1">Option B</option>
            <option value="2">Option C</option>
            <option value="3">Option D</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-red-600 hover:bg-red-700 p-3 rounded font-semibold transition-all"
        >
          {loading ? "Saving..." : "Save Quiz"}
        </button>

        {message && (
          <p className="col-span-2 text-center mt-4 text-lg text-green-400 font-medium">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
