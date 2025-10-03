// src/pages/admin/AdminDetailsUpload.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";

export default function AdminDetailsUpload() {
  const navigate = useNavigate();
  const { id } = useParams(); // edit mode if present

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

  // ✅ Load Admin for edit mode
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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFile = (e) => setPhoto(e.target.files[0]);

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
      if (photo) data.append("photo", photo);

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
    <div className="min-h-screen bg-gray-100 dark:bg-darkBg py-10 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-white dark:bg-darkCard rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-accent mb-8">
          {id ? "✏️ Edit Admin" : "➕ Add New Admin"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* 🌟 Photo Upload */}
          <div className="md:col-span-3 flex justify-center mb-6">
            <label className="relative w-32 h-32 rounded-full border-4 border-accent shadow-lg cursor-pointer overflow-hidden group">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : existingPhoto ? (
                <img
                  src={`http://localhost:4000${existingPhoto}`}
                  alt="Existing"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  Upload Photo
                </span>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFile}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                Change Photo
              </div>
            </label>
          </div>

          {/* 📝 Basic Info */}
          <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
          <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
          <Input type="date" name="dob" value={formData.dob} onChange={handleChange} />

          {/* Personal */}
          <Input name="age" value={formData.age} onChange={handleChange} placeholder="Age" />
          <Select name="gender" value={formData.gender} onChange={handleChange} options={["Male","Female","Other"]} placeholder="Gender" />
          <Input name="blood" value={formData.blood} onChange={handleChange} placeholder="Blood Group" />

          <Select name="handicap" value={formData.handicap} onChange={handleChange} options={["Yes","No"]} placeholder="Handicap" />
          <Input name="branchName" value={formData.branchName} onChange={handleChange} placeholder="Branch Name" />
          <Input name="branchNo" value={formData.branchNo} onChange={handleChange} placeholder="Branch Number" />

          {/* Professional */}
          <Input name="role" value={formData.role} onChange={handleChange} placeholder="Role" />
          <Input name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary" />
          <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email ID" required />

          <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
          <Input name="altPhone" value={formData.altPhone} onChange={handleChange} placeholder="Alternate Phone" />
          <Select name="experience" value={formData.experience} onChange={handleChange} options={["Fresher","1-3 years","3-5 years","5+ years"]} placeholder="Experience" />

          <Select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} options={["Married","Unmarried"]} placeholder="Marital Status" />
          <Input name="department" value={formData.department} onChange={handleChange} placeholder="Department" />
          <Input name="type" value={formData.type} onChange={handleChange} placeholder="Type" />

          {/* Address */}
          <Input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="md:col-span-3" />
          <Input name="district" value={formData.district} onChange={handleChange} placeholder="District" />
          <Input name="state" value={formData.state} onChange={handleChange} placeholder="State" />
          <Input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" />

          {/* Skills */}
          <Input name="language" value={formData.language} onChange={handleChange} placeholder="Language" />
          <Input name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Qualification" />
          <Input name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills" />

          {/* Login */}
          <Input name="userId" value={formData.userId} onChange={handleChange} placeholder="User ID" required />
          <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required={!id} />

          {/* Submit */}
          <div className="md:col-span-3 flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-accent to-blue-500 text-darkBg font-bold rounded-lg shadow-md hover:scale-105 transition-transform duration-300 disabled:opacity-70"
            >
              {loading ? "Saving..." : id ? "Update Admin" : "Save & Complete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* 🟩 Reusable Input */
function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent outline-none transition ${className}`}
    />
  );
}

/* 🟩 Reusable Select */
function Select({ name, value, onChange, options, placeholder, className = "" }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent outline-none transition ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  );
}
