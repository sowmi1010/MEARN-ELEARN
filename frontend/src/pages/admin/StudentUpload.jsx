// src/pages/admin/StudentUpload.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";

export default function StudentUpload() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    age: "",
    gender: "",
    blood: "",
    handicap: "",
    institutionName: "",
    standard: "",
    group: "",
    board: "",
    type: "",
    language: "",
    father: "",
    mother: "",
    fatherOccupation: "",
    motherOccupation: "",
    email: "",
    phone: "",
    altPhone: "",
    fees: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    userId: "",
    password: "",
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch student in edit mode
  useEffect(() => {
    if (id) fetchStudent();
  }, [id]);

  async function fetchStudent() {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/student/detailed-students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ ...res.data, password: "" });
    } catch (err) {
      console.error("❌ Fetch student error:", err.response?.data || err.message);
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleFile(e) {
    setPhoto(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" };

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      if (photo) data.append("photo", photo);

      if (id) {
        await api.put(`/student/detailed-students/${id}`, data, { headers });
        alert("✅ Student updated successfully!");
      } else {
        await api.post("/student/detailed-student", data, { headers });
        alert("🎉 Student added successfully!");
      }
      navigate("/admin/students");
    } catch (err) {
      console.error("❌ Save error:", err.response?.data || err.message);
      alert("❌ " + (err.response?.data?.message || "Failed to save student"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBg text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* ===== Page Header ===== */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 py-8 shadow-lg text-white">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide">
            {id ? "✏️ Edit Student" : "➕ Add Student"}
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto p-6 -mt-8 bg-white/90 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-10"
      >
        {/* ===== Photo Upload ===== */}
        <div className="flex flex-col items-center gap-3">
          <label className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer border-4 border-teal-400 shadow-lg hover:scale-105 transition overflow-hidden flex items-center justify-center">
            {photo ? (
              <img src={URL.createObjectURL(photo)} alt="preview" className="w-32 h-32 object-cover" />
            ) : (
              <span className="text-gray-500 dark:text-gray-300 text-sm">📸 Upload Photo</span>
            )}
            <input type="file" className="hidden" onChange={handleFile} />
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click the circle above to upload profile picture
          </p>
        </div>

        {/* ===== Personal Information ===== */}
        <section>
          <h2 className="text-xl font-bold text-teal-500 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
            👤 Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="input-style" required />
            <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="input-style" />
            <input type="date" name="dob" value={formData.dob ? formData.dob.substring(0,10) : ""} onChange={handleChange} className="input-style" />
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="input-style" />
            <select name="gender" value={formData.gender} onChange={handleChange} className="input-style">
              <option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option>
            </select>
            <input name="blood" placeholder="Blood Group" value={formData.blood} onChange={handleChange} className="input-style" />
            <input name="handicap" placeholder="Handicap" value={formData.handicap} onChange={handleChange} className="input-style" />
          </div>
        </section>

        {/* ===== Academic Information ===== */}
        <section>
          <h2 className="text-xl font-bold text-teal-500 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
            📘 Academic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="institutionName" placeholder="Institution Name" value={formData.institutionName} onChange={handleChange} className="input-style" />
            <input name="standard" placeholder="Standard" value={formData.standard} onChange={handleChange} className="input-style" />
            <input name="group" placeholder="Group" value={formData.group} onChange={handleChange} className="input-style" />
            <input name="board" placeholder="Board" value={formData.board} onChange={handleChange} className="input-style" />
            <input name="type" placeholder="Type" value={formData.type} onChange={handleChange} className="input-style" />
            <input type="number" name="fees" placeholder="Fees" value={formData.fees} onChange={handleChange} className="input-style" />
            <input name="language" placeholder="Language" value={formData.language} onChange={handleChange} className="input-style" />
          </div>
        </section>

        {/* ===== Parents Information ===== */}
        <section>
          <h2 className="text-xl font-bold text-teal-500 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
            👪 Parents Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="father" placeholder="Father's Name" value={formData.father} onChange={handleChange} className="input-style" />
            <input name="fatherOccupation" placeholder="Father's Occupation" value={formData.fatherOccupation} onChange={handleChange} className="input-style" />
            <input name="mother" placeholder="Mother's Name" value={formData.mother} onChange={handleChange} className="input-style" />
            <input name="motherOccupation" placeholder="Mother's Occupation" value={formData.motherOccupation} onChange={handleChange} className="input-style" />
            <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="input-style" />
            <input name="altPhone" placeholder="Alternate Phone Number" value={formData.altPhone} onChange={handleChange} className="input-style" />
            <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} className="input-style" />
          </div>
        </section>

        {/* ===== Address Information ===== */}
        <section>
          <h2 className="text-xl font-bold text-teal-500 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
            🏠 Address Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="input-style md:col-span-2" />
            <input name="district" placeholder="District" value={formData.district} onChange={handleChange} className="input-style" />
            <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className="input-style" />
            <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="input-style" />
          </div>
        </section>

        {/* ===== Account Credentials ===== */}
        <section>
          <h2 className="text-xl font-bold text-teal-500 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
            🔐 Account Credentials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="userId" placeholder="User ID" value={formData.userId} onChange={handleChange} className="input-style" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input-style" required={!id} />
          </div>
        </section>

        {/* ===== Submit Button ===== */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : id ? "Update ✅" : "Save & Complete ✅"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* 🔹 Add this to globals.css or index.css for consistent input style:
*/
