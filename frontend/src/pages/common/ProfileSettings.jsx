// ProfileSettings.jsx — FINAL UPDATED VERSION
import React, { useEffect, useState, useRef } from "react";
import api from "../../utils/api";
import { FaCamera, FaChevronDown, FaChevronUp } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function ProfileSettings() {
  const [form, setForm] = useState({});
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  // Collapsibles
  const [openPersonal, setOpenPersonal] = useState(true);
  const [openContact, setOpenContact] = useState(true);
  const [openAcademic, setOpenAcademic] = useState(false);
  const [openParents, setOpenParents] = useState(false);
  const [openWork, setOpenWork] = useState(false);
  const [openAddress, setOpenAddress] = useState(true);
  const [openAccount, setOpenAccount] = useState(false);

  /* ============================================================
      LOAD PROFILE
  ============================================================ */
  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const res = await api.get("/profile");
      const data = res.data || {};

      setForm(data);
      setRole(data.role);

      if (data.photo || data.profilePic) {
        setPreview(`http://localhost:4000${data.photo || data.profilePic}`);
      }
    } catch (err) {
      console.error("LOAD PROFILE ERROR", err);
      toast.error("Failed to load profile");
    }
    setLoading(false);
  }

  /* ============================================================
      CHANGE HANDLER
  ============================================================ */
  const change = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));

    // auto age calculate from dob
    if (name === "dob") {
      if (value) {
        const age = calcAge(value);
        setForm((p) => ({ ...p, age }));
      }
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const calcAge = (dobStr) => {
    try {
      const dob = new Date(dobStr);
      const diff = Date.now() - dob.getTime();
      const ageDt = new Date(diff);
      return Math.abs(ageDt.getUTCFullYear() - 1970);
    } catch (e) {
      return form.age || "";
    }
  };

  /* ============================================================
      VALIDATIONS
  ============================================================ */
  const validate = () => {
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Enter a valid email");
      return false;
    }

    if (!form.phone || !/^[0-9]{7,15}$/.test(form.phone)) {
      toast.error("Enter a valid phone number");
      return false;
    }

    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      toast.error("Pincode must be 6 digits");
      return false;
    }
    return true;
  };

  /* ============================================================
      SAVE PROFILE (IMPORTANT FIX INCLUDED)
  ============================================================ */
  async function saveProfile(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== undefined && form[key] !== null) {
        data.append(key, form[key]);
      }
    });

    if (photoFile) data.append("photo", photoFile);

    try {
      const res = await api.put("/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = res.data;

      // Update current page
      setForm(updated);

      // Update global storage
      localStorage.setItem("user", JSON.stringify(updated));

      // Tell StudentLayout to refresh sidebar
      window.dispatchEvent(new Event("user-updated"));

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("SAVE ERROR", err);
      toast.error("Failed to update profile");
    }

    setSaving(false);
  }

  /* ============================================================
      UTIL
  ============================================================ */
  const box =
    "bg-[#111827] border border-gray-700 px-4 py-3 rounded-lg w-full text-sm text-gray-300";

  const getFirstName = () => {
    if (form.firstName) return form.firstName;
    if (form.name) return form.name.split(" ")[0];
    return "";
  };

  const getLastName = () => {
    if (form.lastName) return form.lastName;
    if (form.name && form.name.split(" ").length > 1)
      return form.name.split(" ")[1];
    return "";
  };

  const isStudent = role === "student";
  const isAdmin = role === "admin";
  const isMentor = role === "mentor";
  const isUser = role === "user";

  if (loading)
    return <div className="text-white p-10 text-xl">Loading profile...</div>;

  /* ============================================================
      UI STARTS
  ============================================================ */

  return (
    <div className="max-w-5xl mx-auto mt-6 p-6 text-white">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

      <form
        onSubmit={saveProfile}
        className="border border-blue-500 rounded-xl p-6 bg-[#05070d] space-y-6"
      >
        {/* ================= PROFILE PHOTO ================= */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => fileRef.current.click()}
            className="w-24 h-24 rounded-full bg-gray-800 cursor-pointer relative overflow-hidden border-2 border-blue-600"
          >
            <img
              src={preview || "/default-avatar.png"}
              alt="avatar"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full">
              <FaCamera />
            </div>
          </div>
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />

          <div>
            <h3 className="text-2xl font-semibold">{getFirstName()}</h3>
            <p className="text-gray-400">{role}</p>
          </div>
        </div>

        {/* ##################################################
                PERSONAL DETAILS
        ################################################## */}
        <section className="bg-[#0b1220] p-4 rounded-lg">
          <header
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setOpenPersonal((s) => !s)}
          >
            <h4 className="font-semibold">Personal Details</h4>
            {openPersonal ? <FaChevronUp /> : <FaChevronDown />}
          </header>

          {openPersonal && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <input
                name="firstName"
                placeholder="First Name"
                className={box}
                value={getFirstName()}
                onChange={change}
              />

              <input
                name="lastName"
                placeholder="Last Name"
                className={box}
                value={getLastName()}
                onChange={change}
              />

              <div />

              {/* DOB, AGE, GENDER */}
              <input
                name="dob"
                type="date"
                className={box}
                value={form.dob?.substring(0, 10) || ""}
                onChange={change}
              />

              <input
                name="age"
                placeholder="Age"
                className={box}
                value={form.age || ""}
                onChange={change}
              />

              <select
                name="gender"
                className={box}
                value={form.gender || ""}
                onChange={change}
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <input
                name="blood"
                placeholder="Blood Group"
                className={box}
                value={form.blood || ""}
                onChange={change}
              />

              <input
                name="handicap"
                placeholder="Handicap"
                className={box}
                value={form.handicap || ""}
                onChange={change}
              />
            </div>
          )}
        </section>

        {/* ##################################################
                CONTACT DETAILS
        ################################################## */}
        <section className="bg-[#0b1220] p-4 rounded-lg">
          <header
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setOpenContact((s) => !s)}
          >
            <h4 className="font-semibold">Contact Details</h4>
            {openContact ? <FaChevronUp /> : <FaChevronDown />}
          </header>

          {openContact && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <input
                name="email"
                placeholder="Email"
                className={box}
                value={form.email || ""}
                onChange={change}
              />

              <input
                name="phone"
                placeholder="Phone Number"
                className={box}
                value={form.phone || ""}
                onChange={change}
              />

              <input
                name="altPhone"
                placeholder="Alternate Phone"
                className={box}
                value={form.altPhone || ""}
                onChange={change}
              />
            </div>
          )}
        </section>

        {/* ##################################################
                STUDENT ACADEMIC (Only Student)
        ################################################## */}
        {isStudent && (
          <section className="bg-[#0b1220] p-4 rounded-lg">
            <header
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setOpenAcademic((s) => !s)}
            >
              <h4 className="font-semibold">Academic Details</h4>
              {openAcademic ? <FaChevronUp /> : <FaChevronDown />}
            </header>

            {openAcademic && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <input
                  name="institutionName"
                  placeholder="Institution Name"
                  className={box}
                  value={form.institutionName || ""}
                  onChange={change}
                />

                <input
                  name="standard"
                  placeholder="Standard"
                  className={box}
                  value={form.standard || ""}
                  onChange={change}
                />

                <input
                  name="group"
                  placeholder="Group"
                  className={box}
                  value={form.group || ""}
                  onChange={change}
                />

                <input
                  name="board"
                  placeholder="Board"
                  className={box}
                  value={form.board || ""}
                  onChange={change}
                />

                <input
                  name="type"
                  placeholder="Type"
                  className={box}
                  value={form.type || ""}
                  onChange={change}
                />

                <input
                  name="language"
                  placeholder="Language"
                  className={box}
                  value={form.language || ""}
                  onChange={change}
                />
              </div>
            )}
          </section>
        )}

        {/* ##################################################
                ADDRESS SECTION
        ################################################## */}
        <section className="bg-[#0b1220] p-4 rounded-lg">
          <header
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setOpenAddress((s) => !s)}
          >
            <h4 className="font-semibold">Address</h4>
            {openAddress ? <FaChevronUp /> : <FaChevronDown />}
          </header>

          {openAddress && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <input
                name="address"
                placeholder="Address"
                className={box}
                value={form.address || ""}
                onChange={change}
              />

              <input
                name="district"
                placeholder="District"
                className={box}
                value={form.district || ""}
                onChange={change}
              />

              <input
                name="state"
                placeholder="State"
                className={box}
                value={form.state || ""}
                onChange={change}
              />

              <input
                name="pincode"
                placeholder="Pincode"
                className={box}
                value={form.pincode || ""}
                onChange={change}
              />
            </div>
          )}
        </section>

        {/* ##################################################
                ACCOUNT SECTION
        ################################################## */}
        <section className="bg-[#0b1220] p-4 rounded-lg">
          <header
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setOpenAccount((s) => !s)}
          >
            <h4 className="font-semibold">Account</h4>
            {openAccount ? <FaChevronUp /> : <FaChevronDown />}
          </header>

          {openAccount && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {form.userId && (
                <input
                  name="userId"
                  className={box + " bg-gray-900"}
                  value={form.userId}
                  readOnly
                />
              )}

              <input
                name="password"
                type="password"
                placeholder="New Password"
                className={box}
                onChange={change}
              />

              <div />
            </div>
          )}
        </section>

        {/* SAVE BUTTON */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-600 px-8 py-2 rounded-lg hover:bg-blue-700 text-lg disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
