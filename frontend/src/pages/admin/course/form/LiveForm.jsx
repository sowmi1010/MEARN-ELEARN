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

import { FaBroadcastTower } from "react-icons/fa";

export default function LiveForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    group: "",
    standard: "",
    groupCode: "", // ✅ IMPORTANT
    board: "",
    language: "",
    subject: "",
    category: "",
    title: "",
    description: "",
    date: "",
    time: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const categoryOptions = [
    "Live Class",
    "Doubt Session",
    "Revision",
    "Exam Preparation",
    "Workshop",
    "Seminar",
  ];

  /* =========================
        LOAD LIVE (EDIT)
  ========================== */
  useEffect(() => {
    if (!id) return;

    const fetchLive = async () => {
      try {
        const res = await api.get(`/live/${id}`);
        const live = res.data;

        setFormData({
          group: live.group || "",
          standard: live.standard || "",
          groupCode: live.groupCode || "",
          board: live.board || "",
          language: live.language || "",
          subject: live.subject || "",
          category: live.category || "",
          title: live.title || "",
          description: live.description || "",
          date: live.date ? live.date.split("T")[0] : "",
          time: live.time || "",
        });

        if (live.thumbnail) {
          const fixed = live.thumbnail.replace(/\\/g, "/");
          setPreview(`http://localhost:4000/${fixed}`);
        }
      } catch (err) {
        console.error("Fetch live error:", err);
      }
    };

    fetchLive();
  }, [id]);

  /* =========================
        HANDLE CHANGE
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
      });
    } else if (name === "standard") {
      setFormData({
        ...formData,
        standard: value,
        groupCode: "",
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

  /* =========================
        SUBJECT LOADER (FIXED)
  ========================== */
  const getSubjects = () => {
    const { group, standard, groupCode } = formData;

    if (!group) return [];

    // Non-LEAF groups
    if (group !== "LEAF") {
      return subjectMap[group] || [];
    }

    if (!standard) return [];

    // 9th & 10th
    if (standard === "9th" || standard === "10th") {
      return subjectMap.LEAF[standard] || [];
    }

    // 11th & 12th — FIXED
    if ((standard === "11th" || standard === "12th") && groupCode) {
      const normalizedGroupCode = groupCode
        .trim()
        .toUpperCase()
        .replace(/\s+/g, " "); // 🔥 CRITICAL FIX

      const key = `${standard}-${normalizedGroupCode}`;

      return subjectMap.LEAF[key] || [];
    }

    return [];
  };

  /* =========================
        FILE CHANGE
  ========================== */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  /* =========================
        SUBMIT
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([k, v]) => form.append(k, v));
      if (thumbnail) form.append("thumbnail", thumbnail);

      const token = localStorage.getItem("token");

      if (isEdit) {
        await api.put(`/live/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Live updated successfully");
      } else {
        await api.post("/live", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Live created successfully");
      }

      setTimeout(() => navigate("/admin/courses"), 1200);
    } catch (err) {
      console.error("Save error:", err);
      setMessage("❌ Failed to save live");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a1025] to-[#111827] text-white px-6 py-10">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold flex justify-center items-center gap-3">
          <FaBroadcastTower className="text-red-400" />
          {isEdit ? "Update Live" : "Add Live"}
        </h1>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-[#0f172a]/80 rounded-2xl border border-white/10 p-10 space-y-8"
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

        {/* SUBJECT + CATEGORY + TIME */}
        <div className="grid md:grid-cols-3 gap-6">
          <Dropdown
            label="Subject"
            name="subject"
            value={formData.subject}
            options={getSubjects()}
            onChange={handleChange}
          />
          <Dropdown
            label="Category"
            name="category"
            value={formData.category}
            options={categoryOptions}
            onChange={handleChange}
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="p-3 rounded-lg bg-[#111827]/70 border border-white/10"
          />
        </div>

        {/* DATE */}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="p-3 rounded-lg bg-[#111827]/70 border border-white/10 w-full"
        />

        {/* TITLE */}
        <input
          name="title"
          placeholder="Enter the title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-[#111827]/70 border border-white/10"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Enter the description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-[#111827]/70 border border-white/10"
        />

        {/* THUMBNAIL */}
        <div className="border border-white/20 rounded-xl p-6 text-center">
          <p className="text-sm mb-2">Upload Thumbnail</p>
          <input type="file" onChange={handleFileChange} />
          {preview && (
            <img src={preview} className="mt-4 mx-auto h-40 rounded-lg" />
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
        >
          {loading ? "Saving..." : "COMPLETE"}
        </button>

        {message && <p className="text-center text-green-400">{message}</p>}
      </form>
    </div>
  );
}
