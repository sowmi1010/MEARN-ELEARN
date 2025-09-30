// src/pages/admin/MentorUpload.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUser, FaBuilding, FaPhone, FaHome, FaLock, FaArrowLeft } from "react-icons/fa";
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
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" };

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((val) => data.append(key, val));
      } else if (formData[key]) {
        data.append(key, formData[key]);
      }
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

  return (
    <div className="p-8 bg-darkCard rounded-xl shadow-lg max-w-6xl mx-auto space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-accent">
          {id ? "Edit Mentor" : "Add Mentor"}
        </h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-600 transition"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Upload Photo */}
        <div className="flex flex-col items-center gap-3">
          <label className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition">
            {photo ? (
              <img src={URL.createObjectURL(photo)} alt="preview" className="w-32 h-32 rounded-full object-cover" />
            ) : (
              <span className="text-gray-400">📸 Upload Photo</span>
            )}
            <input type="file" className="hidden" onChange={handleFile} />
          </label>
          <p className="text-sm text-gray-400">Click to upload profile picture</p>
        </div>

        {/* Personal Info */}
        <section>
          <h2 className="flex items-center text-xl font-semibold text-accent mb-4"><FaUser className="mr-2" /> Personal Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" required />
            <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <select name="gender" value={formData.gender} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white">
              <option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option>
            </select>
            <input name="blood" placeholder="Blood Group" value={formData.blood} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="handicap" placeholder="Handicap" value={formData.handicap} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white">
              <option value="">Marital Status</option><option>Married</option><option>Unmarried</option>
            </select>
          </div>
        </section>

        {/* Job Details */}
        <section>
          <h2 className="flex items-center text-xl font-semibold text-accent mb-4"><FaBuilding className="mr-2" /> Job Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input name="branchName" placeholder="Branch Name" value={formData.branchName} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="branchNumber" placeholder="Branch Number" value={formData.branchNumber} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="role" placeholder="Role" value={formData.role} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="qualification" placeholder="Qualification" value={formData.qualification} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="language" placeholder="Language" value={formData.language} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="skills" placeholder="Skills" value={formData.skills} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="type" placeholder="Employment Type" value={formData.type} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
          </div>
        </section>

        {/* Contact Info */}
        <section>
          <h2 className="flex items-center text-xl font-semibold text-accent mb-4"><FaPhone className="mr-2" /> Contact Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" required />
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" required />
            <input name="altPhone" placeholder="Alternate Phone" value={formData.altPhone} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
          </div>
        </section>

        {/* Address */}
        <section>
          <h2 className="flex items-center text-xl font-semibold text-accent mb-4"><FaHome className="mr-2" /> Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white md:col-span-3" />
            <input name="district" placeholder="District" value={formData.district} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
          </div>
        </section>

        {/* Credentials */}
        <section>
          <h2 className="flex items-center text-xl font-semibold text-accent mb-4"><FaLock className="mr-2" /> Login Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="userId" placeholder="User ID" value={formData.userId} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" required={!id} />
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-500 transition"
          >
            <FaArrowLeft /> Back
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-accent text-darkBg font-bold rounded-lg shadow hover:scale-105 transition"
          >
            {id ? "Update Mentor" : "Save & Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
