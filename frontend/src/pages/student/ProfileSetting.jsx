// src/pages/ProfileSettings.jsx
import React, { useEffect, useRef, useState } from "react";
import api from "../../utils/api"; // see utils/api.js in the same canvas
import { FaCamera, FaTrashAlt, FaSpinner, FaCheck } from "react-icons/fa";

/**
 * ProfileSettings
 * - Mode: 'student' (self-edit) or 'admin' (create/edit student manually)
 * - Dark purple + glossy layout to match screenshots
 * - Uses TailwindCSS classes. Ensure Tailwind is configured in your project.
 *
 * Notes:
 * - Existing photo URL is built from api.defaults.baseURL + photoPath returned by backend
 * - For quick visual preview we reference uploaded screenshots (local paths) as placeholders
 *   /mnt/data/Screenshot 2025-11-19 120639.png
 *   /mnt/data/Screenshot 2025-11-19 120718.png
 *
 * Usage:
 * <ProfileSettings mode="student" />    // student editing own profile (calls /student/profile)
 * <ProfileSettings mode="admin" studentId={id} /> // admin editing/creating a student
 */

export default function ProfileSettings({ mode = "student", studentId = null }) {
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
    aim: "",
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

  // photo handling
  const [existingPhoto, setExistingPhoto] = useState(null); // full URL
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    // only load when student mode OR admin with studentId
    if (mode === "student") loadStudentDetails();
    if (mode === "admin" && studentId) loadStudentDetails(studentId);

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line
  }, [mode, studentId]);

  async function loadStudentDetails(id) {
    setLoading(true);
    try {
      // student mode -> GET /student/profile
      // admin mode -> GET /admin/students/:id (create doesn't call this)
      let res;
      if (mode === "student") {
        res = await api.get("/student/profile");
      } else if (mode === "admin" && id) {
        res = await api.get(`/admin/students/${id}`);
      } else {
        setLoading(false);
        return;
      }

      const data = res.data;
      const dobString = data.dob ? data.dob.substring(0, 10) : "";

      setFormData((prev) => ({
        ...prev,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        dob: dobString,
        age: data.age || "",
        gender: data.gender || "",
        blood: data.blood || "",
        handicap: data.handicap || "",
        institutionName: data.institutionName || "",
        standard: data.standard || "",
        group: data.group || "",
        board: data.board || "",
        type: data.type || "",
        aim: data.aim || "",
        language: data.language || "",

        father: data.father || "",
        mother: data.mother || "",
        fatherOccupation: data.fatherOccupation || "",
        motherOccupation: data.motherOccupation || "",

        email: data.email || "",
        phone: data.phone || "",
        altPhone: data.altPhone || "",

        address: data.address || "",
        district: data.district || "",
        state: data.state || "",
        pincode: data.pincode || "",

        userId: data.userId || "",
        fees: data.fees || "",
      }));

      // backend returns photo path like "/uploads/students/xxx.jpg"
      if (data.photo) setExistingPhoto(`${api.defaults.baseURL || ""}${data.photo}`);
      else {
        // use the uploaded screenshot as a placeholder preview for local testing (dev only)
        setExistingPhoto("/mnt/data/Screenshot 2025-11-19 120639.png");
      }

      setMessage(null);
    } catch (err) {
      console.error("Profile load error:", err);
      setMessage({ type: "error", text: "Failed to load profile" });
    }
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }

  function selectFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please upload an image" });
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setMessage({ type: "error", text: "Max file size 3MB" });
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPhotoFile(file);
    setMessage(null);
  }

  function handleFileInput(e) {
    const file = e.target.files[0];
    selectFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    selectFile(file);
  }
  function handleDragOver(e) {
    e.preventDefault();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // validation (for admin creating a student require userId+password)
      if (!formData.firstName || !formData.email || !formData.phone) {
        setMessage({ type: "error", text: "First name, email & phone are required." });
        setSaving(false);
        return;
      }
      if (mode === "admin" && !formData.userId) {
        setMessage({ type: "error", text: "User ID is required for admin-created students." });
        setSaving(false);
        return;
      }

      const data = new FormData();
      Object.keys(formData).forEach((k) => {
        if (formData[k] !== undefined && formData[k] !== null) data.append(k, formData[k]);
      });
      if (photoFile) data.append("photo", photoFile);

      if (mode === "student") {
        await api.put("/student/profile", data, { headers: { "Content-Type": "multipart/form-data" } });
      } else if (mode === "admin") {
        if (studentId) {
          await api.put(`/admin/students/${studentId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        } else {
          await api.post(`/admin/students`, data, { headers: { "Content-Type": "multipart/form-data" } });
        }
      }

      setMessage({ type: "success", text: "Saved successfully." });
      // reload to get server photo path
      if (mode === "student") await loadStudentDetails();
      else if (mode === "admin" && studentId) await loadStudentDetails(studentId);

      setPhotoFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error("Save error:", err);
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to save" });
    } finally {
      setSaving(false);
    }
  }

  function removeSelectedPhoto() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setPhotoFile(null);
      return;
    }
    if (existingPhoto) {
      // Better: call backend to remove the photo and update student record.
      // Here we simply clear it client-side; add API endpoint /student/photo/delete or similar.
      setExistingPhoto(null);
    }
  }

  const inputClass =
    "w-full p-3 rounded-xl border border-gray-700 bg-[#0B1117] text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07070b] to-[#0b0f19] text-white py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-300">Profile / Student Details</h2>
          <div className="text-sm text-gray-400">Mode: <span className="text-gray-200">{mode}</span></div>
        </header>

        <div className="bg-black/60 border border-gray-800 rounded-2xl shadow-lg p-6 grid lg:grid-cols-3 gap-6">
          {/* LEFT: Photo & instructions */}
          <div className="flex flex-col items-center gap-4">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current.click()}
              className="relative w-36 h-36 rounded-full bg-gradient-to-br from-[#0f0f13] to-[#12141b] border-4 border-[#2b1b3b] flex items-center justify-center overflow-hidden cursor-pointer shadow-inner"
              title="Click or drop image"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
              ) : existingPhoto ? (
                <img src={existingPhoto} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-indigo-200">
                  <FaCamera className="text-3xl" />
                  <span className="text-sm mt-1">Upload Photo</span>
                </div>
              )}

              <div className="absolute bottom-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current.click();
                  }}
                  className="p-2 rounded-md bg-indigo-600/90 hover:bg-indigo-500 transition"
                >
                  <FaCamera />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedPhoto();
                  }}
                  className="p-2 rounded-md bg-red-600/90 hover:bg-red-500 transition"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />

            <p className="text-sm text-gray-400 text-center max-w-xs">
              Profile photo (max 3MB). Click or drop an image to upload. Avatar is rounded and used across the app.
            </p>

            <div className="w-full text-xs text-gray-400 mt-2">
              <div>Account ID</div>
              <div className="mt-1 text-sm text-gray-200">{formData.userId || "—"}</div>
            </div>
          </div>

          {/* MIDDLE + RIGHT: Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2">
            {message && (
              <div className={`px-4 py-3 rounded mb-4 text-sm ${message.type === "success" ? "bg-emerald-900/40 text-emerald-300" : "bg-red-900/40 text-red-300"}`}>
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} className={inputClass} />
              <input name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} className={inputClass} />

              <input type="date" name="dob" value={formData.dob || ""} onChange={(e) => {
                const val = e.target.value;
                setFormData((p) => ({ ...p, dob: val }));
                if (val) {
                  const age = Math.max(0, new Date().getFullYear() - new Date(val).getFullYear());
                  setFormData((p) => ({ ...p, age }));
                }
              }} className={inputClass} />

              <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} className={inputClass} />

              <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <input name="blood" placeholder="Blood group" value={formData.blood} onChange={handleChange} className={inputClass} />

              <select name="handicap" value={formData.handicap} onChange={handleChange} className={inputClass}>
                <option value="">Handicap</option>
                <option>No</option>
                <option>Yes</option>
              </select>

              <input name="institutionName" placeholder="Institution name" value={formData.institutionName} onChange={handleChange} className={inputClass} />

              <input name="standard" placeholder="Standard" value={formData.standard} onChange={handleChange} className={inputClass} />

              <select name="group" value={formData.group} onChange={handleChange} className={inputClass}>
                <option value="">Group</option>
                <option>Science</option>
                <option>Commerce</option>
                <option>Arts</option>
              </select>

              <input name="board" placeholder="Board" value={formData.board} onChange={handleChange} className={inputClass} />

              <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                <option value="">Type</option>
                <option>Full-time</option>
                <option>Part-time</option>
              </select>

              <input name="aim" placeholder="Aim" value={formData.aim} onChange={handleChange} className={inputClass} />

              <input name="language" placeholder="Language" value={formData.language} onChange={handleChange} className={inputClass} />

              <input name="father" placeholder="Father's name" value={formData.father} onChange={handleChange} className={inputClass} />
              <input name="fatherOccupation" placeholder="Father occupation" value={formData.fatherOccupation} onChange={handleChange} className={inputClass} />

              <input name="mother" placeholder="Mother's name" value={formData.mother} onChange={handleChange} className={inputClass} />
              <input name="motherOccupation" placeholder="Mother occupation" value={formData.motherOccupation} onChange={handleChange} className={inputClass} />

              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className={inputClass} />
              <input name="phone" placeholder="Phone number" value={formData.phone} onChange={handleChange} className={inputClass} />

              <input name="altPhone" placeholder="Alt phone" value={formData.altPhone} onChange={handleChange} className={inputClass} />

              <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className={`${inputClass} md:col-span-2 lg:col-span-3`} />

              <input name="district" placeholder="District" value={formData.district} onChange={handleChange} className={inputClass} />
              <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className={inputClass} />
              <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className={inputClass} />

              <input name="userId" placeholder="User ID" value={formData.userId} onChange={handleChange} className={inputClass} />
              <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className={inputClass} />

              <input name="fees" placeholder="Fees" value={formData.fees} onChange={handleChange} className={inputClass} />
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-xs text-gray-400">Last saved: <span className="text-gray-300">—</span></div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (mode === "student") loadStudentDetails();
                    else if (mode === "admin" && studentId) loadStudentDetails(studentId);
                    setPreviewUrl(null);
                    setPhotoFile(null);
                    setMessage({ type: "success", text: "Changes reverted." });
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-700 text-sm text-gray-200 hover:bg-[#0d1620] transition"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold shadow-lg hover:from-purple-500 hover:to-indigo-400 transition flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaCheck /> {mode === "admin" ? (studentId ? "Update Student" : "Create Student") : "Save Changes"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {loading && (
          <div className="mt-4 text-gray-400 flex items-center gap-2">
            <FaSpinner className="animate-spin" /> Loading...
          </div>
        )}
      </div>
    </div>
  );
}
