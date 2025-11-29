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
} from "../../../../utils/courseOptions";

import { FaBook, FaSave } from "react-icons/fa";

export default function BookForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    group: "",
    standard: "",
    groupCode: "", // ✅ for 11th / 12th
    board: "",
    language: "",
    subject: "",
    title: "",
    about: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ✅ LOAD BOOK WHEN EDITING */
  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        const book = res.data;

        setFormData({
          group: book.group || "",
          standard: book.standard || "",
          groupCode: book.groupCode || "",
          board: book.board || "",
          language: book.language || "",
          subject: book.subject || "",
          title: book.title || "",
          about: book.about || "",
        });

        if (book.thumbnail) {
          const fixed = book.thumbnail.replace(/\\/g, "/");
          setPreview(
            fixed.startsWith("http") ? fixed : `http://localhost:4000/${fixed}`
          );
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchBook();
  }, [id]);

  /* ========================
      HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "group") {
      setFormData({
        ...formData,
        group: value,
        standard: "",
        groupCode: "",
        subject: "",
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

  /* ========================
      GET SUBJECTS (SMART)
  ========================= */
  const getSubjects = () => {
    const { group, standard, groupCode } = formData;

    if (!group) return [];

    // ROOT / STEM / FLOWER / FRUIT / SEED
    if (group !== "LEAF") {
      return subjectMap[group] || [];
    }

    if (!standard) return [];

    // 9th / 10th
    if (standard === "9th" || standard === "10th") {
      return subjectMap.LEAF[standard] || [];
    }

    // 11th / 12th
    if ((standard === "11th" || standard === "12th") && groupCode) {
      const key = `${standard}-${groupCode.toUpperCase()}`;
      return subjectMap.LEAF[key] || [];
    }

    return [];
  };

  /* ✅ HANDLE FILE UPLOAD */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (e.target.name === "thumbnail") {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setFile(file);
    }
  };

  /* ✅ SUBMIT */
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
        await api.put(`/books/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Book updated successfully");
      } else {
        await api.post(`/books/upload`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Book added successfully");
      }

      setTimeout(() => navigate("/admin/courses"), 1200);
    } catch (err) {
      console.error("Save Error:", err);
      setMessage("❌ Failed to save book");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] px-6 py-10">
      {/* PAGE HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col items-center mb-12">
        <div className="flex items-center gap-3">
          <FaBook className="text-4xl text-blue-400 drop-shadow-lg" />

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wide">
            {isEdit ? "Update Book" : "Add New Book"}
          </h1>
        </div>

        <p className="text-gray-400 mt-2">
          Fill the details below to upload a book to the course library.
        </p>
      </div>

      {/* FORM CONTAINER */}
      <form
        onSubmit={handleSubmit}
        className="
        max-w-6xl mx-auto
        bg-[#0b1120]/80 
        backdrop-blur-xl
        border border-white/10 
        shadow-xl 
        rounded-3xl 
        p-10 
        space-y-10
      "
      >
        {/* ======================== */}
        {/*       GROUP ROW          */}
        {/* ======================== */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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

          {(formData.standard === "11th" || formData.standard === "12th") && (
            <Dropdown
              label="Group Code"
              name="groupCode"
              value={formData.groupCode}
              options={["BIO MATHS", "COMPUTER", "COMMERCE"]}
              onChange={handleChange}
              required
            />
          )}

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

        {/* SUBJECT */}
        <Dropdown
          label="Subject"
          name="subject"
          value={formData.subject}
          options={getSubjects()}
          onChange={handleChange}
          required
        />

        {/* TEXT INPUTS */}
        <div className="space-y-6">
          <div>
            <label className="text-gray-300 mb-2 block">Book Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter book title"
              value={formData.title}
              onChange={handleChange}
              required
              className="
              w-full p-4 rounded-xl 
              bg-[#111827]/70 
              border border-white/10 
              focus:outline-none 
              focus:border-blue-500 
              transition
            "
            />
          </div>

          <div>
            <label className="text-gray-300 mb-2 block">Description</label>
            <textarea
              name="about"
              placeholder="Write something about this book..."
              value={formData.about}
              onChange={handleChange}
              rows="4"
              className="
              w-full p-4 rounded-xl 
              bg-[#111827]/70 
              border border-white/10
              focus:outline-none 
              focus:border-blue-500
            "
            />
          </div>
        </div>

        {/* FILE UPLOAD SECTIONS */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Thumbnail Upload */}
          <div className="bg-[#111827]/70 border border-white/10 rounded-2xl p-6">
            <p className="text-sm text-gray-300 mb-3 font-medium">
              Book Thumbnail
            </p>

            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              className="text-gray-300"
            />

            {preview && (
              <div className="mt-5 flex justify-center">
                <img
                  src={preview}
                  alt="preview"
                  className="h-48 w-60 rounded-xl object-cover shadow-lg border border-white/20"
                />
              </div>
            )}
          </div>

          {/* Book File Upload */}
          <div className="bg-[#111827]/70 border border-white/10 rounded-2xl p-6">
            <p className="text-sm text-gray-300 mb-3 font-medium">
              Upload Book File (PDF / EPUB)
            </p>

            <input
              type="file"
              name="file"
              accept=".pdf,.epub"
              onChange={handleFileChange}
              className="text-gray-300"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="
          w-full flex items-center justify-center gap-3 
          py-4 rounded-2xl text-lg font-semibold
          bg-gradient-to-r from-green-500 to-emerald-600
          hover:brightness-110 transition 
          shadow-lg shadow-green-500/30
        "
        >
          <FaSave />
          {loading ? "Saving..." : isEdit ? "Update Book" : "Add Book"}
        </button>

        {/* SUCCESS MESSAGE */}
        {message && (
          <p className="text-center text-green-400 text-lg mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}
