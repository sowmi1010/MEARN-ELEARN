import React, { useState, useEffect } from "react";
import { HiOutlineUserAdd, HiOutlineCamera, HiOutlineMail, HiOutlineOfficeBuilding, HiOutlineUserCircle } from "react-icons/hi";
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
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto bg-gray-800/70 rounded-2xl shadow-xl border border-gray-700 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10 border-b border-gray-700 pb-4">
          <HiOutlineUserAdd className="text-blue-400 text-3xl" />
          <h1 className="text-3xl font-bold text-white tracking-wide">
            {id ? "Edit Admin" : "Add Admin"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Upload Photo */}
          <div className="md:col-span-3 flex justify-center mb-6">
            <label className="relative w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg cursor-pointer overflow-hidden group bg-gray-700">
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
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-sm">
                  <HiOutlineCamera className="text-3xl mb-2" />
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
                Change Photo
              </div>
            </label>
          </div>

          {/* First Row */}
          <Input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
          <Input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
          <Input type="date" name="dob" value={formData.dob} onChange={handleChange} />

          <Input name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
          <Select name="gender" value={formData.gender} onChange={handleChange} options={["Male","Female","Other"]} placeholder="Gender" />
          <Input name="blood" placeholder="Blood Group" value={formData.blood} onChange={handleChange} />

          <Select name="handicap" value={formData.handicap} onChange={handleChange} options={["Yes","No"]} placeholder="Handicap" />
          <Input name="branchName" placeholder="Branch Name" value={formData.branchName} onChange={handleChange} />
          <Input name="branchNo" placeholder="Branch Number" value={formData.branchNo} onChange={handleChange} />

          <Input name="role" placeholder="Role" value={formData.role} onChange={handleChange} />
          <Input name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} />
          <Input name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} type="email" />

          <Input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
          <Input name="altPhone" placeholder="Alternate Phone" value={formData.altPhone} onChange={handleChange} />
          <Select name="experience" value={formData.experience} onChange={handleChange} options={["Fresher","1-3 years","3-5 years","5+ years"]} placeholder="Experience" />

          <Select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} options={["Married","Unmarried"]} placeholder="Marital Status" />
          <Input name="department" placeholder="Department" value={formData.department} onChange={handleChange} />
          <Input name="type" placeholder="Type" value={formData.type} onChange={handleChange} />

          <Input className="md:col-span-3" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
          <Input name="district" placeholder="District" value={formData.district} onChange={handleChange} />
          <Input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
          <Input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />

          <Input name="language" placeholder="Language" value={formData.language} onChange={handleChange} />
          <Input name="qualification" placeholder="Qualification" value={formData.qualification} onChange={handleChange} />
          <Input name="skills" placeholder="Skills" value={formData.skills} onChange={handleChange} />

          <Input name="userId" placeholder="User ID" value={formData.userId} onChange={handleChange} />
          <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required={!id} />

          <div className="md:col-span-3 flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold text-white shadow-lg transition"
            >
              {loading ? "Saving..." : id ? "Update Admin" : "Complete"}
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

/* Reusable Select */
function Select({ name, value, onChange, options, placeholder, className = "" }) {
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
