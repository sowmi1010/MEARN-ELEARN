// src/pages/admin/MentorUpload.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaUser,
  FaBuilding,
  FaPhone,
  FaHome,
  FaLock,
  FaArrowLeft,
} from "react-icons/fa";
import api from "../../utils/api";

export default function MentorUpload() {
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
    branchName: "",
    branchNumber: "",
    role: "",
    email: "",
    phone: "",
    altPhone: "",
    department: "",
    type: "",
    qualification: "",
    experience: "",
    language: "",
    skills: "",
    salary: "",
    maritalStatus: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    userId: "",
    password: "",
    permissions: [],
  });

  const [photo, setPhoto] = useState(null);

  // ✅ Fetch mentor for edit
  useEffect(() => {
    if (id) fetchMentor();
  }, [id]);

  async function fetchMentor() {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/mentor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ ...res.data, password: "" });
    } catch (err) {
      console.error("❌ Fetch mentor error:", err.response?.data || err.message);
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
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((val) => data.append(key, val));
      } else if (formData[key]) data.append(key, formData[key]);
    });
    if (photo) data.append("photo", photo);

    try {
      if (id) {
        await api.put(`/mentor/${id}`, data, { headers });
        alert("✅ Mentor updated successfully!");
        navigate("/admin/mentors");
      } else {
        const res = await api.post("/mentor", data, { headers });
        alert("🎉 Mentor added successfully!");
        navigate(`/admin/mentors/access/${res.data.mentor._id}`);
      }
    } catch (err) {
      console.error("❌ Save error:", err.response?.data || err.message);
      alert("❌ " + (err.response?.data?.message || "Failed to save mentor"));
    }
  }

  // ✅ Reusable input class
  const inputClass =
    "p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-teal-400 outline-none transition-all";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBg text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* ===== Header Bar ===== */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 py-8 shadow-lg text-white">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide">
            {id ? "✏️ Edit Mentor" : "➕ Add Mentor"}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white/20 hover:bg-white/30 shadow-md transition"
          >
            <FaArrowLeft /> Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 dark:bg-gray-800/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 space-y-10"
        >
          {/* ===== Photo Upload ===== */}
          <div className="flex flex-col items-center gap-3">
            <label className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-teal-400 shadow-lg hover:scale-105 cursor-pointer transition overflow-hidden flex items-center justify-center">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="preview"
                  className="w-32 h-32 object-cover"
                />
              ) : (
                <span className="text-gray-500 dark:text-gray-300 text-sm text-center">
                  📸 Upload Photo
                </span>
              )}
              <input type="file" className="hidden" onChange={handleFile} />
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click to upload mentor’s profile picture
            </p>
          </div>

          {/* ===== Personal Info ===== */}
          <section>
            <h2 className="flex items-center text-xl font-bold text-teal-500 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
              <FaUser className="mr-2" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={inputClass}
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className={inputClass}
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input
                name="blood"
                placeholder="Blood Group"
                value={formData.blood}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="handicap"
                placeholder="Handicap"
                value={formData.handicap}
                onChange={handleChange}
                className={inputClass}
              />
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Marital Status</option>
                <option>Married</option>
                <option>Unmarried</option>
              </select>
            </div>
          </section>

          {/* ===== Job Details ===== */}
          <section>
            <h2 className="flex items-center text-xl font-bold text-teal-500 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
              <FaBuilding className="mr-2" /> Job Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                name="branchName"
                placeholder="Branch Name"
                value={formData.branchName}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="branchNumber"
                placeholder="Branch Number"
                value={formData.branchNumber}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="role"
                placeholder="Role"
                value={formData.role}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="qualification"
                placeholder="Qualification"
                value={formData.qualification}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="experience"
                placeholder="Experience"
                value={formData.experience}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="language"
                placeholder="Language"
                value={formData.language}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="skills"
                placeholder="Skills"
                value={formData.skills}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="salary"
                placeholder="Salary"
                value={formData.salary}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="type"
                placeholder="Employment Type"
                value={formData.type}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </section>

          {/* ===== Contact Info ===== */}
          <section>
            <h2 className="flex items-center text-xl font-bold text-teal-500 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
              <FaPhone className="mr-2" /> Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                required
              />
              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
                required
              />
              <input
                name="altPhone"
                placeholder="Alternate Phone"
                value={formData.altPhone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </section>

          {/* ===== Address ===== */}
          <section>
            <h2 className="flex items-center text-xl font-bold text-teal-500 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
              <FaHome className="mr-2" /> Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className={`${inputClass} md:col-span-3`}
              />
              <input
                name="district"
                placeholder="District"
                value={formData.district}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </section>

          {/* ===== Credentials ===== */}
          <section>
            <h2 className="flex items-center text-xl font-bold text-teal-500 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
              <FaLock className="mr-2" /> Login Credentials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="userId"
                placeholder="User ID"
                value={formData.userId}
                onChange={handleChange}
                className={inputClass}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={inputClass}
                required={!id}
              />
            </div>
          </section>

          {/* ===== Submit Buttons ===== */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 shadow hover:scale-105 transition"
            >
              <FaArrowLeft /> Back
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition"
            >
              {id ? "✅ Update Mentor" : "💾 Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
