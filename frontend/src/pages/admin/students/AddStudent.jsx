import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";

export default function AddStudent() {
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
    language: "",
    father: "",
    mother: "",
    fatherOccupation: "",
    motherOccupation: "",
    email: "",
    phone: "",
    altPhone: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    userId: "",
    password: "",
    fees: "",
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

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
      console.error("Fetch student error:", err.response?.data || err.message);
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
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      if (photo) data.append("photo", photo);

      if (id) {
        await api.put(`/student/detailed-students/${id}`, data, { headers });
        alert("Student updated successfully!");
      } else {
        await api.post("/student/detailed-student", data, { headers });
        alert("Student added successfully!");
      }
      navigate("/admin/students");
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save student");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "p-3 rounded-md border border-gray-700 bg-gray-800 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none transition-all";

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-10">Add Student</h1>

      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-7xl bg-[#111827] border border-gray-800 rounded-2xl shadow-xl p-10 grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* ===== LEFT SIDE (Photo + basic info) ===== */}
        <div className="flex flex-col items-center lg:items-start gap-6">
          <div className="flex flex-col items-center">
            <label className="w-40 h-40 rounded-full bg-gray-700 cursor-pointer border-4 border-blue-400 shadow-lg hover:scale-105 transition overflow-hidden flex items-center justify-center">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="preview"
                  className="w-40 h-40 object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 mb-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5v-9m0 0L9.75 9.75M12 7.5l2.25 2.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Upload Photo</span>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleFile} />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full">
            <input
              type="date"
              name="dob"
              value={formData.dob?.substring(0, 10) || ""}
              onChange={handleChange}
              className={inputClass}
              placeholder="Date of Birth"
            />
            <input
              name="institutionName"
              placeholder="Institution Name"
              value={formData.institutionName}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="father"
              placeholder="Father"
              value={formData.father}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="fatherOccupation"
              placeholder="Father Occupation"
              value={formData.fatherOccupation}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="userId"
              placeholder="User ID"
              value={formData.userId}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* ===== RIGHT SIDE (Main form grid) ===== */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="firstName"
            placeholder="Enter the first name"
            value={formData.firstName}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            name="lastName"
            placeholder="Enter the last name"
            value={formData.lastName}
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
            placeholder="Blood"
            value={formData.blood}
            onChange={handleChange}
            className={inputClass}
          />
          <select
            name="handicap"
            value={formData.handicap}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Handicap</option>
            <option>Yes</option>
            <option>No</option>
          </select>
          <select
            name="standard"
            value={formData.standard}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Standard</option>
            {[
              "1st",
              "2nd",
              "3rd",
              "4th",
              "5th",
              "6th",
              "7th",
              "8th",
              "9th",
              "10th",
              "11th",
              "12th",
            ].map((std) => (
              <option key={std}>{std}</option>
            ))}
          </select>
          <select
            name="group"
            value={formData.group}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Group</option>
            <option>First</option>
            <option>Second</option>
            <option>Flower</option>
            <option>Leaf</option>
          </select>
          <select
            name="board"
            value={formData.board}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Board</option>
            <option>Tamil Nadu</option>
            <option>CBSE</option>
          </select>

          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Language</option>
            <option>Tamil</option>
            <option>English</option>
          </select>

          <input
            name="language"
            placeholder="Language"
            value={formData.language}
            onChange={handleChange}
            className={inputClass}
          />
          <input
            type="number"
            name="fees"
            placeholder="Enter the Fees"
            value={formData.fees}
            onChange={handleChange}
            className={inputClass}
          />
          <input
            name="mother"
            placeholder="Mother"
            value={formData.mother}
            onChange={handleChange}
            className={inputClass}
          />
          <input
            name="motherOccupation"
            placeholder="Mother Occupation"
            value={formData.motherOccupation}
            onChange={handleChange}
            className={inputClass}
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className={`${inputClass} md:col-span-2`}
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
          <input
            type="password"
            name="password"
            placeholder="Enter the Password"
            value={formData.password}
            onChange={handleChange}
            className={inputClass}
            required={!id}
          />
        </div>

        {/* ===== Button ===== */}
        <div className="col-span-full flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "COMPLETE"}
          </button>
        </div>
      </form>
    </div>
  );
}
