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
    groupCode: "",   // ✅ for 11th / 12th
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
            fixed.startsWith("http")
              ? fixed
              : `http://localhost:4000/${fixed}`
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
    <div className="p-10 bg-[#0b1120] text-white min-h-screen">

      <h1 className="text-3xl font-bold mb-10 text-center flex justify-center items-center gap-3 text-green-400">
        <FaBook />
        {isEdit ? "Edit Book" : "Add New Book"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 max-w-6xl mx-auto rounded-2xl p-10 space-y-6"
      >

        {/* ===== Row 1 ===== */}
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

        {/* ===== Subject ===== */}
        <Dropdown
          label="Subject"
          name="subject"
          value={formData.subject}
          options={getSubjects()}
          onChange={handleChange}
          required
        />

        {/* ===== Text ===== */}
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
        />

        <textarea
          name="about"
          placeholder="About this book..."
          value={formData.about}
          onChange={handleChange}
          rows="3"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
        />

        {/* ===== FILES ===== */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-4 rounded-xl">
            <p className="mb-2 text-sm">Upload Thumbnail</p>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
            />

            {preview && (
              <div className="mt-4 flex justify-center">
                <img
                  src={preview}
                  alt="preview"
                  className="h-40 w-56 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-4 rounded-xl">
            <p className="mb-2 text-sm">Upload Book File</p>
            <input
              type="file"
              name="file"
              accept=".pdf,.epub"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* ===== SUBMIT ===== */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 py-3 rounded-lg font-bold flex justify-center items-center gap-2"
        >
          <FaSave />
          {loading ? "Saving..." : isEdit ? "Update Book" : "Add Book"}
        </button>

        {message && (
          <p className="text-center mt-4 text-green-400">{message}</p>
        )}

      </form>
    </div>
  );
}
