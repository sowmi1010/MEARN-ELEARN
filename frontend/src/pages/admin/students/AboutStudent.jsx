import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../utils/api";
import { FaEdit, FaArrowLeft, FaUserCircle } from "react-icons/fa";

export default function AboutStudent() {
  const { id } = useParams();
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
      console.error(
        "Fetch student error:",
        err.response?.data || err.message
      );
    }
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0E18] text-gray-400">
        <FaUserCircle className="text-6xl mb-4 text-teal-400 animate-pulse" />
        <p className="text-lg font-medium">Loading student details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E18] text-gray-200 px-10 py-10">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-wide text-white">
            Student Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Overview of academic and personal details
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/admin/students/edit/${student._id}`}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            <FaEdit /> Edit
          </Link>
        </div>
      </div>

      {/* ===== Profile Section ===== */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* === Profile Card === */}
        <div className="lg:w-1/3 bg-[#101626]/70 border border-gray-800 rounded-2xl p-8 text-center shadow-xl">
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-teal-500 shadow-lg">
              {student.photo ? (
                <img
                  src={`${API_URL}${student.photo}`}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400 text-sm">
                  No Photo
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-white mt-5">
              {student.firstName} {student.lastName}
            </h2>
            <p className="text-gray-400 text-sm">{student.email}</p>
            <p className="text-teal-400 mt-1 text-sm">{student.phone}</p>

            <div className="mt-4 bg-teal-500/10 border border-teal-400 rounded-lg px-4 py-2 text-teal-300 text-sm font-medium">
              User ID: {student.userId}
            </div>
          </div>
        </div>

        {/* === Info Details === */}
        <div className="lg:w-2/3 space-y-8">
          <InfoSection title="Academic Information">
            <InfoGrid
              data={{
                Institution: student.institutionName,
                Board: student.board,
                Standard: student.standard,
                Group: student.group,
                Language: student.language,
                Fees: student.fees,
              }}
            />
          </InfoSection>

          <InfoSection title="Personal Information">
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

          <InfoSection title="Parent Information">
            <InfoGrid
              data={{
                Father: student.father,
                "Father Occupation": student.fatherOccupation,
                Mother: student.mother,
                "Mother Occupation": student.motherOccupation,
              }}
            />
          </InfoSection>

          <InfoSection title="Contact Information">
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

/* === Section Title === */
function InfoSection({ title, children }) {
  return (
    <div>
      <h3 className="text-teal-400 text-lg font-semibold mb-3 border-b border-gray-700 pb-1">
        {title}
      </h3>
      {children}
    </div>
  );
}

/* === Info Grid === */
function InfoGrid({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Object.entries(data).map(([key, val]) => (
        <div
          key={key}
          className="bg-[#111C2D]/60 border border-gray-800 rounded-lg p-4 hover:border-teal-400/50 transition"
        >
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
            {key}
          </p>
          <p className="text-base font-medium text-gray-100">{val || "—"}</p>
        </div>
      ))}
    </div>
  );
}
