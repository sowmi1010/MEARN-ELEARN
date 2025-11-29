// src/pages/profile/ProfileSettings.jsx
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
  const [openAddress, setOpenAddress] = useState(true);
  const [openAccount, setOpenAccount] = useState(false);

  /* ---------------------- LOAD PROFILE ---------------------- */
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

  /* ---------------------- INPUT CHANGE HANDLER ---------------------- */
  const change = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));

    if (name === "dob") {
      setForm((p) => ({ ...p, age: calcAge(value) }));
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
    } catch {
      return form.age || "";
    }
  };

  /* ---------------------- VALIDATION ---------------------- */
  const validate = () => {
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Enter a valid email");
      return false;
    }
    if (!form.phone || !/^[0-9]{7,15}$/.test(form.phone)) {
      toast.error("Enter valid phone number");
      return false;
    }
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      toast.error("Pincode must be 6 digits");
      return false;
    }
    return true;
  };

  /* ---------------------- SAVE PROFILE ---------------------- */
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
      setForm(updated);

      localStorage.setItem("user", JSON.stringify(updated));
      window.dispatchEvent(new Event("user-updated"));

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("SAVE ERROR", err);
      toast.error("Failed to update profile");
    }

    setSaving(false);
  }

  /* ---------------------- INPUT UI CLASS ---------------------- */
  const box =
    "bg-[#111827]/60 backdrop-blur-lg border border-white/10 px-4 py-3 rounded-xl w-full text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  const getFirstName = () =>
    form.firstName || form.name?.split(" ")[0] || "";
  const getLastName = () =>
    form.lastName ||
    (form.name?.split(" ").length > 1 ? form.name.split(" ")[1] : "");

  const isStudent = role === "student";

  if (loading)
    return (
      <div className="text-white p-10 text-xl">Loading profile…</div>
    );

  /* -------------------------------------------------------------
      COLLAPSIBLE SECTION COMPONENT
  ------------------------------------------------------------- */
  const Section = ({ title, open, toggle, children }) => (
    <div className="bg-[#0b1220] p-5 rounded-xl border border-white/10 shadow-lg">
      <header
        className="flex justify-between items-center cursor-pointer"
        onClick={toggle}
      >
        <h4 className="text-xl font-semibold">{title}</h4>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </header>

      {open && <div className="mt-5">{children}</div>}
    </div>
  );

  /* -------------------------------------------------------------
      UI STARTS
  ------------------------------------------------------------- */

  return (
    <div className="max-w-5xl mx-auto mt-6 p-6 text-white">
      <Toaster position="top-right" />

      {/* Page Title */}
      <div className="mb-6 pb-4 border-b border-white/10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Profile Settings
        </h1>
        <p className="text-gray-400 mt-1">
          Manage your profile and personal details.
        </p>
      </div>

      {/* Main Container */}
      <form
        onSubmit={saveProfile}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 space-y-10 shadow-2xl"
      >
        {/* ---------------- PROFILE PHOTO ---------------- */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => fileRef.current.click()}
            className="w-28 h-28 rounded-full relative cursor-pointer group border-4 border-blue-500/40 overflow-hidden hover:border-blue-500 transition"
          >
            <img
              src={preview || "/default-avatar.png"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex justify-center items-center transition">
              <FaCamera className="text-white text-xl" />
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
            <h3 className="text-2xl font-bold">{getFirstName()}</h3>
            <p className="text-blue-400 capitalize">{role}</p>
          </div>
        </div>

        {/* ---------------- PERSONAL DETAILS ---------------- */}
        <Section
          title="Personal Details"
          open={openPersonal}
          toggle={() => setOpenPersonal(!openPersonal)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="firstName"
              className={box}
              placeholder="First Name"
              value={getFirstName()}
              onChange={change}
            />

            <input
              name="lastName"
              className={box}
              placeholder="Last Name"
              value={getLastName()}
              onChange={change}
            />

            <div />

            <input
              name="dob"
              type="date"
              className={box}
              value={form.dob?.substring(0, 10) || ""}
              onChange={change}
            />

            <input
              name="age"
              className={box}
              placeholder="Age"
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
        </Section>

        {/* ---------------- CONTACT ---------------- */}
        <Section
          title="Contact Details"
          open={openContact}
          toggle={() => setOpenContact(!openContact)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="email"
              className={box}
              placeholder="Email"
              value={form.email || ""}
              onChange={change}
            />

            <input
              name="phone"
              className={box}
              placeholder="Phone"
              value={form.phone || ""}
              onChange={change}
            />

            <input
              name="altPhone"
              className={box}
              placeholder="Alternate Phone"
              value={form.altPhone || ""}
              onChange={change}
            />
          </div>
        </Section>

        {/* ---------------- STUDENT ACADEMIC ---------------- */}
        {isStudent && (
          <Section
            title="Academic Details"
            open={openAcademic}
            toggle={() => setOpenAcademic(!openAcademic)}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="institutionName"
                className={box}
                placeholder="Institution Name"
                value={form.institutionName || ""}
                onChange={change}
              />

              <input
                name="standard"
                className={box}
                placeholder="Standard"
                value={form.standard || ""}
                onChange={change}
              />

              <input
                name="group"
                className={box}
                placeholder="Group"
                value={form.group || ""}
                onChange={change}
              />

              <input
                name="board"
                className={box}
                placeholder="Board"
                value={form.board || ""}
                onChange={change}
              />

              <input
                name="type"
                className={box}
                placeholder="Type"
                value={form.type || ""}
                onChange={change}
              />

              <input
                name="language"
                className={box}
                placeholder="Language"
                value={form.language || ""}
                onChange={change}
              />
            </div>
          </Section>
        )}

        {/* ---------------- ADDRESS ---------------- */}
        <Section
          title="Address"
          open={openAddress}
          toggle={() => setOpenAddress(!openAddress)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="address"
              className={box}
              placeholder="Address"
              value={form.address || ""}
              onChange={change}
            />

            <input
              name="district"
              className={box}
              placeholder="District"
              value={form.district || ""}
              onChange={change}
            />

            <input
              name="state"
              className={box}
              placeholder="State"
              value={form.state || ""}
              onChange={change}
            />

            <input
              name="pincode"
              className={box}
              placeholder="Pincode"
              value={form.pincode || ""}
              onChange={change}
            />
          </div>
        </Section>

        {/* ---------------- ACCOUNT ---------------- */}
        <Section
          title="Account"
          open={openAccount}
          toggle={() => setOpenAccount(!openAccount)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {form.userId && (
              <input
                className={box + " bg-gray-900"}
                value={form.userId}
                readOnly
              />
            )}

            <input
              name="password"
              type="password"
              className={box}
              placeholder="New Password"
              onChange={change}
            />
          </div>
        </Section>

        {/* ---------------- SAVE BUTTON ---------------- */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-10 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 
              hover:opacity-90 text-white text-lg font-semibold shadow-lg shadow-blue-600/30 
              transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
