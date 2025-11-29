import React, { useState, useEffect } from "react";
import { HiOutlineCamera, HiOutlineArrowLeft, HiOutlineUserCircle} from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";

export default function AddAdmin() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
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

  /* ===============================================
     LOAD ADMIN IN EDIT MODE
  =================================================*/
  useEffect(() => {
    if (id) loadAdmin();
  }, [id]);

  async function loadAdmin() {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/admin/detailed-admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({ ...res.data, password: "" });

      if (res.data?.photo) {
        const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
        setPreview(BASE + res.data.photo);
      }
    } catch (err) {
      console.error("Load admin error:", err);
    }
  }

  /* ===============================================
     GLOBAL SEARCH SUPPORT
  =================================================*/
  useEffect(() => {
    const listener = (e) => setSearch(e.detail);
    window.addEventListener("global-search", listener);
    return () => window.removeEventListener("global-search", listener);
  }, []);

  /* ===============================================
     INPUT HANDLERS
  =================================================*/
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    if (!e.target.files[0]) return;
    setPhoto(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  /* ===============================================
     SUBMIT HANDLER
  =================================================*/
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key]) data.append(key, form[key]);
      });

      if (photo) data.append("photo", photo);

      if (id) {
        await api.put(`/admin/detailed-admins/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Admin Updated Successfully!");
      } else {
        await api.post(`/admin/detailed-admin`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Admin Added Successfully!");
      }

      navigate("/admin/admins");
    } catch (err) {
      console.error(err);
      alert("Failed to save admin");
    } finally {
      setLoading(false);
    }
  }

  /* ===============================================
     UI COMPONENTS
  =================================================*/
  const Input = ({ className = "", ...props }) => (
    <input
      {...props}
      className={`p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500 transition ${className}`}
    />
  );

  const Select = ({ name, value, onChange, options, placeholder }) => (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );

  const Section = ({ title }) => (
    <div className="lg:col-span-3 mt-10 mb-2">
      <h2 className="tracking-wide text-blue-400 font-semibold text-xs border-b border-white/10 pb-2">
        {title}
      </h2>
    </div>
  );

  /* ===============================================
     PAGE UI
  =================================================*/
  return (
    <div className="min-h-screen bg-[#020617] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl p-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-400 flex items-center justify-center shadow-lg">
              <HiOutlineUserCircle className="text-3xl text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {id ? "Edit Admin" : "Add New Admin"}
              </h1>
              <p className="text-gray-400 text-sm">
                Fill all admin details correctly
              </p>
            </div>
          </div>
        </div>

        {/* PHOTO UPLOAD */}
        <div className="flex justify-center mb-12">
          <label className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500/30 bg-black/40 flex items-center justify-center cursor-pointer group">
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <HiOutlineCamera className="text-4xl mb-1" />
                <span className="text-sm">Upload Photo</span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center tracking-widest text-xs">
              CHANGE
            </div>
          </label>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* PERSONAL */}
          <Section title="PERSONAL INFORMATION" />
          <Input
            name="firstName"
            value={form.firstName}
            placeholder="First Name"
            onChange={handleChange}
          />
          <Input
            name="lastName"
            value={form.lastName}
            placeholder="Last Name"
            onChange={handleChange}
          />
          <Input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
          />

          <Input
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
          />
          <Select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            placeholder="Gender"
            options={["Male", "Female", "Other"]}
          />
          <Input
            name="blood"
            placeholder="Blood Group"
            value={form.blood}
            onChange={handleChange}
          />

          {/* OFFICE */}
          <Section title="OFFICE INFORMATION" />
          <Input
            name="branchName"
            placeholder="Branch Name"
            value={form.branchName}
            onChange={handleChange}
          />
          <Input
            name="branchNo"
            placeholder="Branch Number"
            value={form.branchNo}
            onChange={handleChange}
          />
          <Input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
          />

          <Input
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
          />
          <Input
            name="salary"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
          />
          <Select
            name="experience"
            value={form.experience}
            onChange={handleChange}
            options={["Fresher", "1-3 Years", "3-5 Years", "5+ Years"]}
            placeholder="Experience"
          />

          {/* CONTACT */}
          <Section title="CONTACT DETAILS" />
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
          <Input
            name="altPhone"
            placeholder="Alternate Phone"
            value={form.altPhone}
            onChange={handleChange}
          />

          {/* ADDRESS */}
          <Section title="ADDRESS DETAILS" />
          <Input
            className="lg:col-span-3"
            name="address"
            placeholder="Complete Address"
            value={form.address}
            onChange={handleChange}
          />
          <Input
            name="district"
            placeholder="District"
            value={form.district}
            onChange={handleChange}
          />
          <Input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
          />
          <Input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
          />

          {/* EXTRA */}
          <Section title="ADDITIONAL DETAILS" />
          <Input
            name="language"
            placeholder="Languages Known"
            value={form.language}
            onChange={handleChange}
          />
          <Input
            name="qualification"
            placeholder="Qualification"
            value={form.qualification}
            onChange={handleChange}
          />
          <Input
            name="skills"
            placeholder="Skills"
            value={form.skills}
            onChange={handleChange}
          />

          {/* LOGIN */}
          <Section title="LOGIN CREDENTIALS" />
          <Input
            name="userId"
            placeholder="Admin User ID"
            value={form.userId}
            onChange={handleChange}
          />
          <Input
            type="password"
            name="password"
            placeholder={id ? "New Password (optional)" : "Password"}
            value={form.password}
            onChange={handleChange}
            required={!id}
          />

          {/* SUBMIT */}
          <div className="lg:col-span-3 flex justify-end mt-10">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl font-semibold shadow-xl hover:scale-105 transition"
            >
              {loading ? "Saving..." : id ? "Update Admin" : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
