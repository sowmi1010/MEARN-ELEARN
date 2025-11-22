import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineUserPlus,
  HiOutlineCamera,
  HiOutlineBuildingOffice,
  HiOutlinePhone,
  HiOutlineHomeModern,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import api from "../../../utils/api";

export default function MentorUpload() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(1);
  const [skills, setSkills] = useState([]);

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
  const [loading, setLoading] = useState(false);

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
      console.error("Fetch mentor error:", err.response?.data || err.message);
    }
  }

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const addSkill = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      setSkills([...skills, e.target.value]);
      setFormData({
        ...formData,
        skills: [...skills, e.target.value].join(", "),
      });
      e.target.value = "";
    }
  };

  const removeSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
    setFormData({ ...formData, skills: newSkills.join(", ") });
  };

  const handleFile = (e) => setPhoto(e.target.files[0]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });
    if (photo) data.append("photo", photo);

    try {
      if (id) {
        await api.put(`/mentor/${id}`, data, { headers });
        alert("Mentor updated successfully!");
      } else {
        await api.post("/mentor", data, { headers });
        alert("Mentor added successfully!");
      }
      navigate("/admin/mentors");
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save mentor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto bg-gray-800/80 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-800/90 border-b border-gray-700 flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <HiOutlineUserPlus className="text-blue-400 text-2xl" />
            <h1 className="text-2xl font-semibold">
              {id ? "Edit Mentor" : "Add Mentor"}
            </h1>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Upload Photo */}
            <div className="md:col-span-3 flex justify-center mb-4">
              <label className="relative w-32 h-32 rounded-full border-4 border-blue-500 shadow-md cursor-pointer overflow-hidden group bg-gray-700">
                {photo ? (
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-sm">
                    <HiOutlineCamera className="text-3xl mb-1" />
                    Upload Photo
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFile}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs text-white">
                  Change
                </div>
              </label>
            </div>

            {/* Personal Info */}
            <SectionTitle title="Personal Information" />
            <Input
              name="firstName"
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            <Input
              name="lastName"
              placeholder="Enter Last Name"
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
              placeholder="Enter Age"
              value={formData.age}
              onChange={handleChange}
            />
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
              placeholder="Select Gender"
            />
            <Input
              name="blood"
              placeholder="Blood Group"
              value={formData.blood}
              onChange={handleChange}
            />
            <Select
              name="handicap"
              value={formData.handicap}
              onChange={handleChange}
              options={["No", "Yes"]}
              placeholder="Handicap"
            />
            <Select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              options={["Unmarried", "Married"]}
              placeholder="Marital Status"
            />

            {/* Job Details */}
            <SectionTitle title="Job Details" />
            <Input
              name="branchName"
              placeholder="Branch Name"
              value={formData.branchName}
              onChange={handleChange}
            />
            <Input
              name="branchNumber"
              placeholder="Branch Number"
              value={formData.branchNumber}
              onChange={handleChange}
            />
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                "Mentor",
                "Admin",
                "Trainer",
                "Coordinator",
                "Assistant",
              ]}
              placeholder="Select Role"
            />
            <Select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              options={["Fresher", "Junior", "Senior", "Expert"]}
              placeholder="Experience Level"
            />
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={["Full-time", "Part-time", "Contract", "Intern"]}
              placeholder="Employment Type"
            />
            <Input
              name="qualification"
              placeholder="Enter Qualification"
              value={formData.qualification}
              onChange={handleChange}
            />
            <Input
              name="language"
              placeholder="Languages Known"
              value={formData.language}
              onChange={handleChange}
            />
            <Input
              name="skills"
              placeholder="Enter Skills"
              value={formData.skills}
              onChange={handleChange}
            />
            <Input
              name="salary"
              placeholder="Salary (₹)"
              value={formData.salary}
              onChange={handleChange}
            />
            <Input
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
            />

            {/* Contact Info */}
            <SectionTitle title="Contact Information" />
            <Input
              type="email"
              name="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
            <Input
              name="altPhone"
              placeholder="Alternate Phone"
              value={formData.altPhone}
              onChange={handleChange}
            />

            {/* Address */}
            <SectionTitle title="Address" />
            <Input
              className="md:col-span-3"
              name="address"
              placeholder="Enter Full Address"
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

            {/* Login Credentials */}
            <SectionTitle title="Login Credentials" />
            <Input
              name="userId"
              placeholder="Enter User ID"
              value={formData.userId}
              onChange={handleChange}
            />
            <Input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required={!id}
            />

            {/* Submit */}
            <div className="md:col-span-3 flex justify-end mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 px-10 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300"
              >
                {loading ? "Saving..." : id ? "Update Mentor" : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Reusable Input */
function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`p-3 rounded-lg bg-gray-700 border border-gray-600 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition w-full ${className}`}
    />
  );
}

/* 🔹 Reusable Select */
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
      className={`p-3 rounded-lg bg-gray-700 border border-gray-600 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition w-full ${className}`}
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

/* 🔹 Section Title */
function SectionTitle({ title }) {
  return (
    <div className="md:col-span-3 flex items-center gap-2 mt-8 mb-3 border-b border-gray-700 pb-1">
      <h2 className="text-lg font-semibold text-blue-400 uppercase tracking-wide">
        {title}
      </h2>
    </div>
  );
}
