import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";
import Dropdown from "../../../../components/common/Dropdown";
import {
  groupOptions,
  standardOptions,
  boardOptions,
  languageOptions,
  subjectMap,
} from "../../../../utils/courseOptions";

export default function EditTests() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    group: "",
    standard: "",
    board: "",
    language: "",
    subject: "",
    category: "",
    title: "",
  });

  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fileBase = "http://localhost:4000";

  const categoryOptions = [
    "Lesson",
    "Lesson Notes",
    "lesson Test",
    "One Word",
    "Short Answer",
    "Medium Answer",
    "Long Answer",
    "Practical",
    "Important",
    "Exam Paper",
    "Unit Test",
    "Model Paper",
    "Revision Test",
    "Practice Test",
    "Test Paper",
    "Others",
  ];

  // Fetch existing test
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get(`/tests/${id}`);
        const test = res.data;
        setFormData({
          group: test.group || "",
          standard: test.standard || "",
          board: test.board || "",
          language: test.language || "",
          subject: test.subject || "",
          category: test.category || "",
          title: test.title || "",
        });

        const normalizePath = (p) =>
          p ? `${fileBase}/${p.replace(/\\/g, "/")}` : "";

        if (test.thumbnail) setThumbnailPreview(normalizePath(test.thumbnail));
        if (test.file) setFilePreview(normalizePath(test.file));
      } catch (err) {
        console.error(" Failed to fetch test:", err);
        setMessage(" Failed to load test data.");
      }
    };
    fetchTest();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (e.target.name === "thumbnail") {
      setThumbnail(f);
      setThumbnailPreview(URL.createObjectURL(f));
    } else {
      setFile(f);
      setFilePreview(URL.createObjectURL(f));
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
      await api.put(`/tests/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Test updated successfully!");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error(" Update error:", err);
      setMessage("Failed to update test.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
      >
        ⬅ Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center"> Edit Test</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
      >
        <Dropdown label="Group" name="group" value={formData.group} options={groupOptions} onChange={handleChange} required />
        <Dropdown label="Standard" name="standard" value={formData.standard} options={standardOptions[formData.group] || []} onChange={handleChange} required />
        <Dropdown label="Board" name="board" value={formData.board} options={boardOptions} onChange={handleChange} required />
        <Dropdown label="Language" name="language" value={formData.language} options={languageOptions} onChange={handleChange} required />
        <Dropdown label="Subject" name="subject" value={formData.subject} options={subjectMap[formData.group] || []} onChange={handleChange} required />
        <Dropdown label="Category" name="category" value={formData.category} options={categoryOptions} onChange={handleChange} required />

        <input
          type="text"
          name="title"
          placeholder="Test Title"
          value={formData.title}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 border border-gray-600 col-span-2"
          required
        />

        <div>
          <label className="block mb-2 text-gray-300">Change Thumbnail</label>
          <input type="file" name="thumbnail" accept="image/*" onChange={handleFileChange} className="p-2 rounded bg-gray-700 w-full" />
          {thumbnailPreview && (
            <img src={thumbnailPreview} alt="Thumbnail" className="mt-3 rounded-lg w-40 border border-gray-600" />
          )}
        </div>

        <div>
          <label className="block mb-2 text-gray-300">Change Test File</label>
          <input type="file" name="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="p-2 rounded bg-gray-700 w-full" />
          {filePreview && (
            <iframe src={filePreview} title="Test File" className="mt-3 rounded-lg w-full h-60 border border-gray-600" />
          )}
        </div>

        <button type="submit" disabled={loading} className="col-span-2 bg-green-600 hover:bg-green-700 p-3 rounded font-semibold transition-all">
          {loading ? "Updating..." : "Update Test"}
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
