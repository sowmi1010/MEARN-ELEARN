import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import {
  FaEdit,
  FaUserCircle,
  FaArrowLeft,
  FaUserGraduate,
} from "react-icons/fa";

export default function AboutStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchStudent();
  }, [id]);

  async function fetchStudent() {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/student/detailed-students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(res.data);
    } catch (err) {
      console.error("Fetch student error:", err.message);
    }
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0E18] text-gray-400">
        <FaUserCircle className="text-6xl mb-4 text-cyan-400 animate-pulse" />
        <p className="text-lg font-medium">Loading student profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E18] text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold flex gap-3 items-center">
            <FaUserGraduate className="text-cyan-400" />
            Student Profile
          </h1>
          <p className="text-gray-400 mt-1">
            Full academic and personal information
          </p>
        </div>

        <Link
          to={`/admin/students/edit/${student._id}`}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 font-semibold hover:scale-105 transition shadow-lg"
        >
          <FaEdit /> Edit
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* ========== LEFT PROFILE CARD ========== */}
        <div className="lg:w-[360px] bg-[#101626]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">

          <div className="flex flex-col items-center text-center">

            {/* PHOTO */}
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-cyan-400 shadow-lg">
              {student.photo ? (
                <img
                  src={`${API_URL}${student.photo}`}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-300">
                  No Photo
                </div>
              )}
            </div>

            <h2 className="text-xl font-semibold mt-5">
              {student.firstName} {student.lastName}
            </h2>

            <p className="text-gray-400 text-sm">{student.email}</p>
            <p className="text-cyan-400 text-sm mt-1">{student.phone}</p>

            {/* STATUS */}
            <span
              className={`mt-4 px-4 py-1 rounded-full text-sm font-semibold
              ${
                student.fees > 0
                  ? "bg-green-600/30 text-green-400 border border-green-400"
                  : "bg-red-600/30 text-red-400 border border-red-400"
              }`}
            >
              {student.fees > 0 ? "Fees Paid" : "Fees Pending"}
            </span>

            <div className="mt-4 px-4 py-2 bg-cyan-500/10 border border-cyan-500 text-cyan-300 rounded-lg text-sm">
              User ID: {student.userId}
            </div>
          </div>
        </div>

        {/* ========== RIGHT DETAILS ========== */}
        <div className="flex-1 space-y-10">

          <InfoSection title="🎓 Academic Information">
            <InfoGrid
              data={{
                Institution: student.institutionName,
                Board: student.board,
                Standard: student.standard,
                Group: student.group,
                Language: student.language,
                Fees: `₹ ${student.fees || 0}`,
              }}
            />
          </InfoSection>

          <InfoSection title="🧍 Personal Information">
            <InfoGrid
              data={{
                "Date of Birth": student.dob?.substring(0, 10),
                Age: student.age,
                Gender: student.gender,
                "Blood Group": student.blood,
                Handicap: student.handicap,
              }}
            />
          </InfoSection>

          <InfoSection title="👨‍👩‍👧 Parent Information">
            <InfoGrid
              data={{
                Father: student.father,
                "Father Occupation": student.fatherOccupation,
                Mother: student.mother,
                "Mother Occupation": student.motherOccupation,
              }}
            />
          </InfoSection>

          <InfoSection title="📍 Contact Information">
            <InfoGrid
              data={{
                "Alt Phone": student.altPhone,
                Address: student.address,
                District: student.district,
                State: student.state,
                Pincode: student.pincode,
              }}
            />
          </InfoSection>

        </div>
      </div>
    </div>
  );
}

/* ===== Section Wrapper ===== */
function InfoSection({ title, children }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-cyan-400 border-b border-gray-800 pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ===== Info Grid ===== */
function InfoGrid({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {Object.entries(data).map(([key, val]) => (
        <div
          key={key}
          className="bg-[#111C2D]/80 border border-gray-800 rounded-xl p-4 hover:border-cyan-400/40 transition"
        >
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
            {key}
          </p>

          <p className="text-base font-semibold">
            {val || <span className="text-gray-500">—</span>}
          </p>
        </div>
      ))}
    </div>
  );
}
