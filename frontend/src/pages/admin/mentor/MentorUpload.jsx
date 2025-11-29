// src/pages/mentors/MentorUpload.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineUserPlus,
  HiOutlineCamera,
  HiOutlineBuildingOffice,
  HiOutlinePhone,
  HiOutlineHomeModern,
  HiOutlineLockClosed,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineCheck,
} from "react-icons/hi2";
import api from "../../../utils/api";

/**
 * Multi-step Mentor Upload (3 steps + summary)
 * Steps:
 *  1 - Personal Info
 *  2 - Job Details
 *  3 - Contact & Login
 *  4 - Summary & Submit
 */

export default function MentorUpload() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [skills, setSkills] = useState([]);

  const [form, setForm] = useState({
    // Personal
    firstName: "",
    lastName: "",
    dob: "",
    age: "",
    gender: "",
    blood: "",
    handicap: "No",
    maritalStatus: "Unmarried",

    // Job
    branchName: "",
    branchNumber: "",
    role: "Mentor",
    department: "",
    type: "Full-time",
    qualification: "",
    experience: "Fresher",
    language: "",
    skills: "",
    salary: "",

    // Contact & Login
    email: "",
    phone: "",
    altPhone: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    userId: "",
    password: "",
    permissions: [],
  });

  // Load existing mentor (edit)
  useEffect(() => {
    if (id) loadMentor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadMentor() {
    try {
      const res = await api.get(`/mentor/${id}`);
      const data = res.data || {};
      // Map response -> form
      setForm((prev) => ({
        ...prev,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        dob: data.dob ? data.dob.substring(0, 10) : "",
        age: data.age || "",
        gender: data.gender || "",
        blood: data.blood || "",
        handicap: data.handicap || "No",
        maritalStatus: data.maritalStatus || "Unmarried",
        branchName: data.branchName || "",
        branchNumber: data.branchNumber || "",
        role: data.role || "Mentor",
        department: data.department || "",
        type: data.type || "Full-time",
        qualification: data.qualification || "",
        experience: data.experience || "Fresher",
        language: data.language || "",
        skills: data.skills || "",
        salary: data.salary || "",
        email: data.email || "",
        phone: data.phone || "",
        altPhone: data.altPhone || "",
        address: data.address || "",
        district: data.district || "",
        state: data.state || "",
        pincode: data.pincode || "",
        userId: data.userId || "",
        // don't prefill password
        password: "",
        permissions: data.permissions || [],
      }));

      // skills array
      const skillArr = data.skills ? String(data.skills).split(",").map(s => s.trim()).filter(Boolean) : [];
      setSkills(skillArr);

      // photo preview if exists (backend returns photo path)
      if (data.photo) {
        const base = import.meta.env.VITE_API_URL || "http://localhost:4000";
        setPhotoPreview(base + data.photo);
      }
    } catch (err) {
      console.error("Load mentor failed", err);
    }
  }

  // handle input change
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  // photo selection
  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  // skills: enter to add
  function handleSkillKey(e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const v = e.target.value?.trim();
    if (!v) return;
    if (!skills.includes(v)) {
      const next = [...skills, v];
      setSkills(next);
      setForm((p) => ({ ...p, skills: next.join(", ") }));
    }
    e.target.value = "";
  }
  function removeSkill(i) {
    const next = skills.filter((_, idx) => idx !== i);
    setSkills(next);
    setForm((p) => ({ ...p, skills: next.join(", ") }));
  }

  // validation per step (simple)
  function validateStep(s) {
    if (s === 1) {
      // require firstName, lastName, email? Not here. Only personal required minimal.
      return !!form.firstName.trim() && !!form.lastName.trim();
    }
    if (s === 2) {
      // require role or department
      return !!form.role.trim() && !!form.department.trim();
    }
    if (s === 3) {
      // contact & login
      const okEmail = !!form.email.trim();
      const okPhone = !!form.phone.trim();
      const okUserId = !!form.userId.trim();
      const okPassword = id ? true : !!form.password; // required on create
      return okEmail && okPhone && okUserId && okPassword;
    }
    return true;
  }

  function nextStep() {
    if (!validateStep(step)) {
      alert("Please fill required fields for this step.");
      return;
    }
    setStep((s) => Math.min(4, s + 1));
  }
  function prevStep() {
    setStep((s) => Math.max(1, s - 1));
  }

  // final submit (POST or PUT)
  async function handleSubmit(e) {
    e.preventDefault();
    // before submit validate all
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      alert("Please complete required fields.");
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(form).forEach((k) => {
        // skip empty password in edit
        if (k === "password" && id && !form.password) return;
        const val = form[k];
        if (Array.isArray(val)) {
          val.forEach((it) => data.append(k, it));
        } else if (val !== undefined && val !== null && String(val) !== "") {
          data.append(k, val);
        }
      });

      if (skills && skills.length) data.set("skills", skills.join(", "));
      if (photo) data.set("photo", photo);

      if (id) {
        await api.put(`/mentor/${id}`, data);
        alert("Mentor updated successfully!");
      } else {
        await api.post("/mentor", data);
        alert("Mentor created successfully!");
      }

      navigate("/admin/mentors");
    } catch (err) {
      console.error("Save error", err);
      const message = err?.response?.data?.message || "Failed to save mentor";
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  // small presentational helpers
  const stepTitles = ["Personal", "Job", "Contact & Login", "Summary"];
  const progressPercent = Math.round(((step - 1) / (stepTitles.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-[#040712] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-black font-bold shadow-lg">
              M
            </div>
            <div>
              <h1 className="text-2xl font-extrabold"> {id ? "Edit Mentor" : "Add Mentor"} </h1>
              <p className="text-gray-400 text-sm">Multi-step mentor form — professional flow</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition flex items-center gap-2"
            >
              <HiOutlineArrowLeft className="text-lg" /> Back
            </button>
          </div>
        </div>

        {/* stepper */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-4 items-center">
              {stepTitles.map((t, i) => (
                <div key={t} className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold
                      ${i + 1 <= step ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-black shadow-md" : "bg-white/5 text-gray-300"}
                    `}
                  >
                    {i + 1}
                  </div>
                  <div className={`text-sm ${i + 1 <= step ? "text-white" : "text-gray-400"}`}>
                    {t}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-300">{step} / {stepTitles.length}</div>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div style={{ width: `${progressPercent}%` }} className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all" />
          </div>
        </div>

        {/* card */}
        <form onSubmit={handleSubmit} className="bg-[#071026]/80 border border-white/6 rounded-2xl p-6 shadow-lg">
          {/* Step 1: Personal */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="w-32 flex-shrink-0">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-400 cursor-pointer"
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400">
                        <HiOutlineCamera size={28} />
                      </div>
                    )}

                    <div className="absolute -bottom-1 right-1 bg-white/10 px-2 py-1 rounded-md text-xs">Change</div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name *" className="p-3 rounded-lg bg-[#0b1624] border border-white/8 outline-none" />
                  <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name *" className="p-3 rounded-lg bg-[#0b1624] border border-white/8 outline-none" />

                  <input name="dob" type="date" value={form.dob} onChange={handleChange} className="p-3 rounded-lg bg-[#0b1624] border border-white/8 outline-none" />
                  <input name="age" value={form.age} onChange={handleChange} placeholder="Age" className="p-3 rounded-lg bg-[#0b1624] border border-white/8 outline-none" />

                  <select name="gender" value={form.gender} onChange={handleChange} className="p-3 rounded-lg bg-[#0b1624] border border-white/8 outline-none">
                    <option value="">Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>

                  <input name="blood" value={form.blood} onChange={handleChange} placeholder="Blood group" className="p-3 rounded-lg bg-[#0b1624] border border-white/8 outline-none" />

                  <select name="handicap" value={form.handicap} onChange={handleChange} className="p-3 rounded-lg bg-[#0b1624] border border-white/8 outline-none">
                    <option value="No">Handicap: No</option>
                    <option value="Yes">Handicap: Yes</option>
                  </select>

                  <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className="p-3 rounded-lg bg-[#0b1624] border border-white/8 outline-none">
                    <option value="Unmarried">Unmarried</option>
                    <option value="Married">Married</option>
                  </select>
                </div>
              </div>

              {/* Skills input */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Skills (press Enter to add)</label>
                <div className="flex gap-2 items-center">
                  <input onKeyDown={handleSkillKey} placeholder="Type a skill and press Enter" className="p-3 rounded-lg bg-[#0b1624] border border-white/8 flex-1" />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <div key={s + i} className="flex items-center gap-2 bg-white/6 px-3 py-1 rounded-full text-sm">
                      <span>{s}</span>
                      <button type="button" onClick={() => removeSkill(i)} className="text-xs text-gray-300">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Job */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="branchName" value={form.branchName} onChange={handleChange} placeholder="Branch name" className="p-3 rounded-lg bg-[#0b1624] border border-white/8" />
                <input name="branchNumber" value={form.branchNumber} onChange={handleChange} placeholder="Branch number" className="p-3 rounded-lg bg-[#0b1624] border border-white/8" />
                <select name="role" value={form.role} onChange={handleChange} className="p-3 rounded-lg bg-[#0b1624] border border-white/8">
                  <option>Mentor</option>
                  <option>Admin</option>
                  <option>Trainer</option>
                  <option>Coordinator</option>
                </select>
                <input name="department" value={form.department} onChange={handleChange} placeholder="Department *" className="p-3 rounded-lg bg-[#0b1624] border border-white/8" />
                <select name="experience" value={form.experience} onChange={handleChange} className="p-3 rounded-lg bg-[#0b1624] border border-white/8">
                  <option>Fresher</option>
                  <option>Junior</option>
                  <option>Senior</option>
                  <option>Expert</option>
                </select>
                <select name="type" value={form.type} onChange={handleChange} className="p-3 rounded-lg bg-[#0b1624] border border-white/8">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Intern</option>
                </select>

                <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="Qualification" className="p-3 rounded-lg bg-[#0b1624] border border-white/8 md:col-span-2" />
                <input name="language" value={form.language} onChange={handleChange} placeholder="Languages known" className="p-3 rounded-lg bg-[#0b1624] border border-white/8" />
                <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary (₹)" className="p-3 rounded-lg bg-[#0b1624] border border-white/8" />
              </div>
            </div>
          )}

          {/* Step 3: Contact & Login */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email *" className="p-3 rounded-lg bg-[#0b1624] border border-white/8" />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone *" className="p-3 rounded-lg bg-[#0b1624] border border-white/8" />
                <input name="altPhone" value={form.altPhone} onChange={handleChange} placeholder="Alternate phone" className="p-3 rounded-lg bg-[#0b1624] border border-white/8" />
                <input name="userId" value={form.userId} onChange={handleChange} placeholder="User ID *" className="p-3 rounded-lg bg-[#0b1624] border border-white/8" />
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder={id ? "Leave blank to keep current password" : "Password *"} className="p-3 rounded-lg bg-[#0b1624] border border-white/8" />
                <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="p-3 rounded-lg bg-[#0b1624] border border-white/8 md:col-span-2" />
                <input name="district" value={form.district} onChange={handleChange} placeholder="District" className="p-3 rounded-lg bg-[#0b1624] border border-white/8" />
                <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="p-3 rounded-lg bg-[#0b1624] border border-white/8" />
                <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" className="p-3 rounded-lg bg-[#0b1624] border border-white/8" />
              </div>
            </div>
          )}

          {/* Step 4: Summary */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Summary</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/6">
                  <h4 className="font-semibold mb-2">Personal</h4>
                  <p><strong>Name:</strong> {form.firstName} {form.lastName}</p>
                  <p><strong>DOB:</strong> {form.dob}</p>
                  <p><strong>Age:</strong> {form.age}</p>
                  <p><strong>Gender:</strong> {form.gender}</p>
                  <p><strong>Skills:</strong> {skills.join(", ") || "—"}</p>
                </div>

                <div className="p-4 rounded-lg bg-white/6">
                  <h4 className="font-semibold mb-2">Job</h4>
                  <p><strong>Role:</strong> {form.role}</p>
                  <p><strong>Department:</strong> {form.department}</p>
                  <p><strong>Experience:</strong> {form.experience}</p>
                  <p><strong>Type:</strong> {form.type}</p>
                  <p><strong>Salary:</strong> {form.salary || "—"}</p>
                </div>

                <div className="p-4 rounded-lg bg-white/6 md:col-span-2">
                  <h4 className="font-semibold mb-2">Contact</h4>
                  <p><strong>Email:</strong> {form.email}</p>
                  <p><strong>Phone:</strong> {form.phone}</p>
                  <p><strong>Address:</strong> {form.address || "—"}</p>
                  <p><strong>User ID:</strong> {form.userId}</p>
                </div>
              </div>
            </div>
          )}

          {/* actions */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition flex items-center gap-2">
                  <HiOutlineArrowLeft /> Back
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {step < 4 && (
                <button type="button" onClick={nextStep} className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 text-black font-semibold shadow">
                  Next <HiOutlineArrowRight className="inline ml-2" />
                </button>
              )}

              {step === 4 && (
                <button type="submit" disabled={loading} className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 text-black font-bold shadow">
                  {loading ? "Saving..." : <span className="flex items-center gap-2"><HiOutlineCheck /> Save Mentor</span>}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
