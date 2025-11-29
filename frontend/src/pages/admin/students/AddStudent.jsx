import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";

import {
  FaCamera,
  FaUser,
  FaUniversity,
  FaAddressCard,
  FaUsers,
  FaIdBadge,
  FaSave,
} from "react-icons/fa";

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

  // Fetch existing data for EDIT
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
      console.error("Fetch error:", err.message);
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

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      if (photo) data.append("photo", photo);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      if (id) {
        await api.put(`/student/detailed-students/${id}`, data, { headers });
        alert("Student updated successfully!");
      } else {
        await api.post("/student/detailed-student", data, { headers });
        alert("Student added successfully!");
      }

      navigate("/admin/students");
    } catch (err) {
      alert("Failed to save student");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "p-3 rounded-xl bg-white/5 border border-white/10 placeholder-gray-400 text-gray-100 focus:ring-2 focus:ring-cyan-400 outline-none";

  return (
    <div className="min-h-screen bg-[#050812] text-white p-8 flex flex-col items-center">

      {/* ================== HEADER ================== */}
      <div className="w-full max-w-7xl mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          {id ? "Edit Student" : "Add New Student"}
        </h1>
        <div className="h-[3px] w-40 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mt-2"></div>
      </div>


      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-7xl 
          bg-white/5 backdrop-blur-xl 
          border border-white/10 shadow-2xl
          rounded-3xl p-10 
          grid grid-cols-1 lg:grid-cols-3 gap-10
        "
      >

        {/* ================= LEFT PROFILE CARD ================= */}
        <div className="flex flex-col items-center gap-6">

          <label className="relative w-40 h-40 rounded-full border-4 border-cyan-500/40 bg-white/5 overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition">
            {photo ? (
              <img
                src={URL.createObjectURL(photo)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-cyan-300">
                <FaCamera className="text-3xl mb-2" />
                <span className="text-sm">Upload Photo</span>
              </div>
            )}
            <input type="file" className="hidden" onChange={handleFile} />
          </label>

          <div className="grid grid-cols-1 gap-4 w-full">

            <Input label="Date of Birth" type="date" name="dob" value={formData.dob?.substring(0, 10)} onChange={handleChange} />

            <Input label="Institution Name" name="institutionName" value={formData.institutionName} onChange={handleChange} />

            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />

            <Input label="Father Name" name="father" value={formData.father} onChange={handleChange} />

            <Input label="Father Occupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} />

            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />

            <Input label="User ID" name="userId" value={formData.userId} onChange={handleChange} />

          </div>
        </div>

        {/* ================= RIGHT FORM AREA ================= */}
        <div className="lg:col-span-2">
          {/* === BASIC INFORMATION === */}
          <Section title="Basic Information" icon={<FaUser />}>
            <Grid>
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              <Input label="Age" name="age" value={formData.age} onChange={handleChange} />
              <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other"]} />
            </Grid>
          </Section>

          {/* === ACADEMIC === */}
          <Section title="Academic Details" icon={<FaUniversity />}>
            <Grid>
              <Select label="Standard" name="standard" value={formData.standard} onChange={handleChange} options={["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"]} />

              <Select label="Group" name="group" value={formData.group} onChange={handleChange} options={["First", "Second", "Flower", "Leaf"]} />

              <Select label="Board" name="board" value={formData.board} onChange={handleChange} options={["Tamil Nadu", "CBSE"]} />

              <Select label="Language" name="language" value={formData.language} onChange={handleChange} options={["Tamil", "English"]} />

              <Input label="Fees Amount" type="number" name="fees" value={formData.fees} onChange={handleChange} />
            </Grid>
          </Section>

          {/* === FAMILY === */}
          <Section title="Family Details" icon={<FaUsers />}>
            <Grid>
              <Input label="Mother Name" name="mother" value={formData.mother} onChange={handleChange} />
              <Input label="Mother Occupation" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} />
              <Input label="Alternate Phone" name="altPhone" value={formData.altPhone} onChange={handleChange} />
            </Grid>
          </Section>

          {/* === ADDRESS === */}
          <Section title="Address Details" icon={<FaAddressCard />}>
            <Grid>
              <Input label="Address" name="address" value={formData.address} onChange={handleChange} span />
              <Input label="District" name="district" value={formData.district} onChange={handleChange} />
              <Input label="State" name="state" value={formData.state} onChange={handleChange} />
              <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
            </Grid>
          </Section>

          {/* === LOGIN INFO === */}
          <Section title="Account Login Details" icon={<FaIdBadge />}>
            <Grid>
              <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required={!id} />
            </Grid>
          </Section>

          {/* SAVE BUTTON */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className="
                px-10 py-3 rounded-xl text-lg font-semibold 
                bg-gradient-to-r from-blue-600 to-cyan-500 
                shadow-lg hover:scale-105 active:scale-95 transition 
                disabled:opacity-50 flex items-center gap-3
              "
            >
              <FaSave />
              {loading ? "Saving..." : "Save Student"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}



/* -------------------------- UI COMPONENTS -------------------------- */

function Section({ title, icon, children }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-cyan-400 text-xl">{icon}</span>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>;
}

function Input({ label, span, ...props }) {
  return (
    <div className={span ? "md:col-span-2" : ""}>
      <label className="text-sm text-gray-300 mb-1 block">{label}</label>
      <input {...props} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 shadow focus:ring-2 focus:ring-cyan-400 outline-none" />
    </div>
  );
}

function Select({ label, options = [], ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-300 mb-1 block">{label}</label>
      <select {...props} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 shadow focus:ring-2 focus:ring-cyan-400 outline-none">
        <option value="">Select {label}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
