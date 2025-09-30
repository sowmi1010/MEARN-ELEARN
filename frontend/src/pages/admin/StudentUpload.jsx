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
    <div className="p-8 bg-darkCard rounded-xl shadow-lg max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-accent mb-6">
        {id ? "Edit Student" : "Add Student"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Photo Upload */}
        <div className="flex justify-center mb-6">
          <label className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition">
            {photo ? (
              <img
                src={URL.createObjectURL(photo)}
                alt="preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-400">Upload Photo</span>
            )}
            <input type="file" className="hidden" onChange={handleFile} />
          </label>
        </div>

        {/* Personal Info */}
        <section>
          <h2 className="text-xl font-semibold text-accent mb-4">👤 Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" required />
            <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input type="date" name="dob" value={formData.dob ? formData.dob.substring(0,10) : ""} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <select name="gender" value={formData.gender} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white">
              <option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option>
            </select>
            <input name="blood" placeholder="Blood Group" value={formData.blood} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="handicap" placeholder="Handicap" value={formData.handicap} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
          </div>
        </section>

        {/* Academic Info */}
        <section>
          <h2 className="text-xl font-semibold text-accent mb-4">📘 Academic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="institutionName" placeholder="Institution Name" value={formData.institutionName} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="standard" placeholder="Standard" value={formData.standard} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="group" placeholder="Group" value={formData.group} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="board" placeholder="Board" value={formData.board} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="type" placeholder="Type" value={formData.type} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="fees" type="number" placeholder="Fees" value={formData.fees} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="language" placeholder="Language" value={formData.language} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
          </div>
        </section>

        {/* Parents Info */}
        <section>
          <h2 className="text-xl font-semibold text-accent mb-4">👪 Parents Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="father" placeholder="Father's Name" value={formData.father} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="fatherOccupation" placeholder="Father's Occupation" value={formData.fatherOccupation} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="mother" placeholder="Mother's Name" value={formData.mother} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="motherOccupation" placeholder="Mother's Occupation" value={formData.motherOccupation} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="altPhone" placeholder="Alternate Phone Number" value={formData.altPhone} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
          </div>
        </section>

        {/* Address Info */}
        <section>
          <h2 className="text-xl font-semibold text-accent mb-4">🏠 Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white md:col-span-2" />
            <input name="district" placeholder="District" value={formData.district} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
            <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" />
          </div>
        </section>

        {/* Credentials */}
        <section>
          <h2 className="text-xl font-semibold text-accent mb-4">🔐 Account Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="userId" placeholder="User ID" value={formData.userId} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white" required={!id} />
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="px-6 py-3 bg-accent text-darkBg font-bold rounded-lg shadow hover:opacity-90 transition">
            {loading ? "Saving..." : "Complete ✅"}
          </button>
        </div>
      </form>
    </div>
  );
}
