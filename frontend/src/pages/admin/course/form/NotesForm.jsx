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

import { FaStickyNote, FaUpload, FaSave, FaEdit } from "react-icons/fa";

export default function NotesForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    group: "",
    standard: "",
    groupCode: "",     // ✅ NEW
    board: "",
    language: "",
    subject: "",
    lesson: "",
    category: "",
    noteNumber: "",
    title: "",
    description: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const categoryOptions = [
    "Lesson",
    "Lesson Notes",
    "One Word",
    "Short Answer",
    "Medium Answer",
    "Long Answer",
    "Practical",
    "Important",
    "Exam Paper",
    "Others",
  ];

  /* ✅ LOAD FOR EDIT */
  useEffect(() => {
    if (!id) return;

    const fetchNotes = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        const note = res.data;

        setFormData({
          group: note.group || "",
          standard: note.standard || "",
          groupCode: note.groupCode || "",
          board: note.board || "",
          language: note.language || "",
          subject: note.subject || "",
          lesson: note.lesson || "",
          category: note.category || "",
          noteNumber: note.noteNumber || "",
          title: note.title || "",
          description: note.description || "",
        });

        if (note.thumbnail) {
          const fixed = note.thumbnail.replace(/\\/g, "/");

          setPreview(
            fixed.startsWith("http")
              ? fixed
              : `http://localhost:4000/${fixed}`
          );
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchNotes();
  }, [id]);

  /* =========================
        HANDLE INPUT CHANGE
  ========================== */
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
    }

    else if (name === "standard") {
      setFormData({
        ...formData,
        standard: value,
        subject: "",
      });
    }

    else if (name === "groupCode") {
      setFormData({
        ...formData,
        groupCode: value,
        subject: "",
      });
    }

    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* =========================
        GET SUBJECTS SMART
  ========================== */
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

    // 11th & 12th
    if ((standard === "11th" || standard === "12th") && groupCode) {
      const key = `${standard}-${groupCode.toUpperCase()}`;
      return subjectMap.LEAF[key] || [];
    }

    return [];
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (e.target.name === "thumbnail") {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();

      Object.entries(formData).forEach(([k, v]) => form.append(k, v));

      if (thumbnail) form.append("thumbnail", thumbnail);
      if (file) form.append("file", file);

      const token = localStorage.getItem("token");

      if (isEdit) {
        await api.put(`/notes/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessage("✅ Notes Updated Successfully");
      } else {
        await api.post("/notes/upload", form, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessage("✅ Notes Added Successfully");
      }

      setTimeout(() => navigate("/admin/courses"), 1200);
    } catch (err) {
      console.error("Save Error:", err);
      setMessage("❌ Failed to save notes");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a1025] to-[#111827] text-white px-6 py-10">

    {/* PAGE HEADER */}
    <div className="max-w-6xl mx-auto flex flex-col items-center mb-10">
      <div className="flex items-center gap-4">
        <FaStickyNote className="text-4xl text-purple-400 drop-shadow-lg" />

        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent tracking-wide">
          {isEdit ? "Edit Notes" : "Create New Notes"}
        </h1>
      </div>

      <p className="text-gray-400 mt-2 text-sm">
        Fill in all details to publish your note content.
      </p>
    </div>

    {/* FORM CONTAINER */}
    <form
      onSubmit={handleSubmit}
      className="
        max-w-6xl mx-auto
        bg-[#0f172a]/70
        backdrop-blur-xl
        rounded-3xl
        border border-white/10
        shadow-2xl shadow-purple-900/20
        p-10
        space-y-10
      "
    >
      {/* ========================== */}
      {/*       ROW 1 (SELECTS)      */}
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
      {/*      SUBJECT / CATEGORY    */}
      {/* ========================== */}
      <div className="grid md:grid-cols-3 gap-6">
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

        <Dropdown
          label="Category"
          name="category"
          value={formData.category}
          options={categoryOptions}
          onChange={handleChange}
        />
      </div>

      {/* ========================== */}
      {/*        TEXT INPUTS         */}
      {/* ========================== */}
      <div className="space-y-6">
        <input
          type="text"
          name="noteNumber"
          placeholder="Note Number"
          value={formData.noteNumber}
          onChange={handleChange}
          className="
            w-full p-4 rounded-xl 
            bg-[#111827]/70 
            border border-white/10
            focus:border-purple-500
            focus:outline-none
            transition
          "
        />

        <input
          type="text"
          name="title"
          placeholder="Note Title"
          value={formData.title}
          onChange={handleChange}
          className="
            w-full p-4 rounded-xl 
            bg-[#111827]/70 
            border border-white/10
            focus:border-purple-500
            focus:outline-none
            transition
          "
        />

        <textarea
          rows="4"
          name="description"
          placeholder="Description..."
          value={formData.description}
          onChange={handleChange}
          className="
            w-full p-4 rounded-xl 
            bg-[#111827]/70 
            border border-white/10
            focus:border-purple-500
            focus:outline-none
            transition
          "
        ></textarea>
      </div>

      {/* ========================== */}
      {/*        FILE UPLOADS        */}
      {/* ========================== */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Thumbnail Block */}
        <div
          className="
            p-6 rounded-2xl
            bg-[#0d1425]/70
            border border-purple-400/20
            hover:border-purple-400/40
            transition
            shadow-lg shadow-purple-900/20
          "
        >
          <p className="mb-3 text-sm text-gray-300">Upload Thumbnail</p>

          <input
            type="file"
            name="thumbnail"
            onChange={handleFileChange}
            className="text-gray-300"
          />

          {preview && (
            <img
              src={preview}
              className="mt-5 h-40 w-56 rounded-xl object-cover border border-white/20 shadow-lg"
            />
          )}
        </div>

        {/* Notes file */}
        <div
          className="
            p-6 rounded-2xl
            bg-[#0d1425]/70
            border border-purple-400/20
            hover:border-purple-400/40
            transition
            shadow-lg shadow-purple-900/20
          "
        >
          <p className="mb-3 text-sm text-gray-300">Upload Notes File</p>

          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="text-gray-300"
          />
        </div>
      </div>

      {/* ========================== */}
      {/*         SUBMIT BUTTON      */}
      {/* ========================== */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full py-4 rounded-xl
          flex items-center justify-center gap-3
          text-lg font-semibold
          bg-gradient-to-r from-purple-600 to-fuchsia-600
          hover:brightness-110 transition 
          shadow-lg shadow-purple-700/30
        "
      >
        <FaSave />
        {loading ? "Saving..." : isEdit ? "Update Notes" : "Publish Notes"}
      </button>

      {/* SUCCESS MESSAGE */}
      {message && (
        <p className="text-center text-green-400 mt-2">{message}</p>
      )}
    </form>
  </div>
);

}
