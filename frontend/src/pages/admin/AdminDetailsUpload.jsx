// src/pages/admin/AdminDetailsUpload.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";

export default function AdminDetailsUpload() {
  const navigate = useNavigate();
  const { id } = useParams(); // edit mode if exists

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    age: "",
    gender: "",
    blood: "",
    handicap: "",
    branchName: "",
    branchNo: "",
    role: "",
    salary: "",
    email: "",
    phone: "",
    altPhone: "",
    experience: "",
    maritalStatus: "",
    department: "",
    type: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    language: "",
    qualification: "",
    skills: "",
    userId: "",
    password: "",
  });

  const [photo, setPhoto] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Load Admin if in Edit Mode
  useEffect(() => {
    if (id) loadAdmin();
  }, [id]);

  async function loadAdmin() {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/admin/detailed-admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ ...res.data, password: "" });
      if (res.data.photo) setExistingPhoto(res.data.photo);
    } catch (err) {
      console.error("❌ Load admin error:", err.response?.data || err.message);
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
      const headers = { Authorization: `Bearer ${token}` };
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      if (photo) data.append("photo", photo); // only append new photo if selected

      if (id) {
        await api.put(`/admin/detailed-admins/${id}`, data, { headers });
        alert("✅ Admin updated successfully!");
      } else {
        await api.post("/admin/detailed-admin", data, { headers });
        alert("🎉 Admin added successfully!");
      }

      navigate("/admin/admins");
    } catch (err) {
      console.error("❌ Save error:", err.response?.data || err.message);
      alert("❌ Failed to save admin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 bg-darkCard rounded-xl shadow-lg max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-accent mb-6 text-center">
        {id ? "✏️ Edit Admin" : "➕ Add Admin"}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ✅ Photo Upload */}
        <div className="md:col-span-3 flex justify-center mb-6">
          <label className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer border-4 border-accent shadow-lg overflow-hidden">
            {photo ? (
              <img
                src={URL.createObjectURL(photo)}
                alt="preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : existingPhoto ? (
              <img
                src={`http://localhost:4000${existingPhoto}`}
                alt="existing"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm text-center px-2">
                Upload Photo
              </span>
            )}
            <input type="file" className="hidden" onChange={handleFile} />
          </label>
        </div>

        {/* ✅ Basic Info */}
        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="input-style" required />
        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="input-style" />
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input-style" />

        {/* ✅ Personal Info */}
        <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="input-style" />
        <select name="gender" value={formData.gender} onChange={handleChange} className="input-style">
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input name="blood" placeholder="Blood Group" value={formData.blood} onChange={handleChange} className="input-style" />

        <select name="handicap" value={formData.handicap} onChange={handleChange} className="input-style">
          <option value="">Handicap</option>
          <option>Yes</option>
          <option>No</option>
        </select>
        <input name="branchName" placeholder="Branch Name" value={formData.branchName} onChange={handleChange} className="input-style" />
        <input name="branchNo" placeholder="Branch Number" value={formData.branchNo} onChange={handleChange} className="input-style" />

        {/* ✅ Professional Info */}
        <input name="role" placeholder="Role" value={formData.role} onChange={handleChange} className="input-style" />
        <input name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} className="input-style" />
        <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} className="input-style" required />

        <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="input-style" required />
        <input name="altPhone" placeholder="Alternate Phone" value={formData.altPhone} onChange={handleChange} className="input-style" />
        <select name="experience" value={formData.experience} onChange={handleChange} className="input-style">
          <option value="">Experience</option>
          <option>Fresher</option>
          <option>1-3 years</option>
          <option>3-5 years</option>
          <option>5+ years</option>
        </select>

        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="input-style">
          <option value="">Marital Status</option>
          <option>Married</option>
          <option>Unmarried</option>
        </select>
        <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} className="input-style" />
        <input name="type" placeholder="Type" value={formData.type} onChange={handleChange} className="input-style" />

        {/* ✅ Address */}
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="input-style md:col-span-3" />
        <input name="district" placeholder="District" value={formData.district} onChange={handleChange} className="input-style" />
        <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className="input-style" />
        <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="input-style" />

        {/* ✅ Skills & Education */}
        <input name="language" placeholder="Language" value={formData.language} onChange={handleChange} className="input-style" />
        <input name="qualification" placeholder="Qualification" value={formData.qualification} onChange={handleChange} className="input-style" />
        <input name="skills" placeholder="Skills" value={formData.skills} onChange={handleChange} className="input-style" />

        {/* ✅ Login Credentials */}
        <input name="userId" placeholder="User ID" value={formData.userId} onChange={handleChange} className="input-style" required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input-style" required={!id} />

        {/* ✅ Submit */}
        <div className="md:col-span-3 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-accent text-darkBg font-bold rounded-lg shadow-lg hover:opacity-90 transition transform hover:scale-105"
          >
            {loading ? "Saving..." : id ? "Update Admin" : "Save & Complete"}
          </button>
        </div>
      </form>
    </div>
  );
}
