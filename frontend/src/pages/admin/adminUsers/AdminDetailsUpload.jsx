import React, { useState, useEffect } from "react";
import {
  HiOutlineUserAdd,
  HiOutlineCamera,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";

export default function AddAdmin() {
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

  // Edit mode load
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
      console.error("Error loading admin:", err);
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
        alert("Admin updated successfully!");
      } else {
        await api.post("/admin/detailed-admin", data, { headers });
        alert("Admin added successfully!");
      }
      navigate("/admin/admins");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save admin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#050b24] to-[#030712] py-16 px-6 text-white">
      <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-blue-500/10 shadow-2xl">
        {/* ========== HEADER ========== */}
        <div className="flex items-center justify-between mb-10 border-b border-blue-500/20 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600/20 p-4 rounded-2xl">
              <HiOutlineUserAdd className="text-blue-400 text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-wide">
                {id ? "Edit Admin Profile" : "Create New Admin"}
              </h1>
              <p className="text-sm text-gray-400">
                Fill the admin details properly
              </p>
            </div>
          </div>
        </div>

        {/* ========== PHOTO UPLOAD ========== */}
        <div className="flex justify-center mb-12">
          <label className="relative w-36 h-36 rounded-full border-4 border-blue-500/50 shadow-lg cursor-pointer overflow-hidden group bg-black/50">
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
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <HiOutlineCamera className="text-4xl mb-1" />
                <span className="text-xs">Upload image</span>
              </div>
            )}

            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFile}
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs text-white tracking-widest">
              CHANGE
            </div>
          </label>
        </div>

        {/* ========== FORM ========== */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* -------- PERSONAL -------- */}
          <Section title="Personal Info" />
          <Input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <Input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <Input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />

          <Input
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
          />
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
            placeholder="Gender"
          />
          <Input
            name="blood"
            placeholder="Blood Group"
            value={formData.blood}
            onChange={handleChange}
          />

          {/* -------- OFFICE -------- */}
          <Section title="Office Info" />
          <Input
            name="branchName"
            placeholder="Branch Name"
            value={formData.branchName}
            onChange={handleChange}
          />
          <Input
            name="branchNo"
            placeholder="Branch No"
            value={formData.branchNo}
            onChange={handleChange}
          />
          <Input
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
          />

          <Input
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
          />
          <Input
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
          />
          <Select
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            options={["Fresher", "1-3 years", "3-5 years", "5+ years"]}
            placeholder="Experience"
          />

          {/* -------- CONTACT -------- */}
          <Section title="Contact Info" />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <Input
            name="altPhone"
            placeholder="Alternate Phone"
            value={formData.altPhone}
            onChange={handleChange}
          />

          {/* -------- ADDRESS -------- */}
          <Section title="Address" />
          <Input
            className="lg:col-span-3"
            name="address"
            placeholder="Full Address"
            value={formData.address}
            onChange={handleChange}
          />
          <Input
            name="district"
            placeholder="District"
            value={formData.district}
            onChange={handleChange}
          />
          <Input
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
          />
          <Input
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
          />

          {/* -------- EXTRA -------- */}
          <Section title="Extra Skills" />
          <Input
            name="language"
            placeholder="Languages Known"
            value={formData.language}
            onChange={handleChange}
          />
          <Input
            name="qualification"
            placeholder="Qualification"
            value={formData.qualification}
            onChange={handleChange}
          />
          <Input
            name="skills"
            placeholder="Skills"
            value={formData.skills}
            onChange={handleChange}
          />

          {/* -------- LOGIN -------- */}
          <Section title="Login Credentials" />
          <Input
            name="userId"
            placeholder="User ID"
            value={formData.userId}
            onChange={handleChange}
          />
          <Input
            type="password"
            name="password"
            placeholder={id ? "New Password (optional)" : "Password"}
            value={formData.password}
            onChange={handleChange}
            required={!id}
          />

          {/* -------- BUTTON -------- */}
          <div className="lg:col-span-3 flex justify-end pt-10">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition font-semibold shadow-xl"
            >
              {loading ? "Saving..." : id ? "Update Admin" : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Reusable Input */
function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none transition w-full ${className}`}
    />
  );
}

function Section({ title }) {
  return (
    <div className="lg:col-span-3 mt-6 mb-2">
      <h3 className="text-blue-400 font-semibold tracking-widest text-sm border-b border-blue-500/20 pb-2">
        {title.toUpperCase()}
      </h3>
    </div>
  );
}


/* Reusable Select */
function Select({
  name,
  value,
  onChange,
  options,
  placeholder,
  className = "",
}) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none transition w-full ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
