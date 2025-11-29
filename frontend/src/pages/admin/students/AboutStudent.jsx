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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#060915] text-gray-400">
        <FaUserCircle className="text-6xl mb-4 text-cyan-400 animate-pulse drop-shadow-lg" />
        <p className="text-lg font-medium">Loading student profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060915] text-white p-6">

      {/* ================= Header ================= */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="flex gap-3 items-center">
            <FaUserGraduate className="text-cyan-400 text-3xl" />
            <h1 className="text-4xl font-extrabold tracking-tight">
              Student Profile
            </h1>
          </div>
          <div className="h-[3px] w-36 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mt-2"></div>

          <p className="text-gray-400 mt-3">
            A complete overview of student's personal & academic information.
          </p>
        </div>

        <Link
          to={`/admin/students/edit/${student._id}`}
          className="
            flex items-center gap-2 px-6 py-3 rounded-xl 
            bg-gradient-to-r from-blue-500 to-cyan-500 
            font-semibold shadow-lg text-white 
            hover:scale-105 active:scale-95 transition-all
          "
        >
          <FaEdit /> Edit Profile
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* =============== Profile Card =============== */}
        <div
          className="
            lg:w-[350px] rounded-3xl p-8 
            bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl
          "
        >
          <div className="flex flex-col items-center">

            {/* PHOTO */}
            <div className="relative">
              <div
                className="
                w-40 h-40 rounded-full overflow-hidden shadow-xl
                border-[3px] border-transparent 
                bg-gradient-to-br from-blue-500 to-cyan-400 p-[3px]
                "
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  {student.photo ? (
                    <img
                      src={`${API_URL}${student.photo}`}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      No Photo
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* NAME */}
            <h2 className="text-2xl font-bold mt-6">
              {student.firstName} {student.lastName}
            </h2>
            <p className="text-gray-400 mt-1 text-sm">{student.email}</p>
            <p className="text-cyan-400 text-sm font-medium">{student.phone}</p>

            {/* FEE STATUS */}
            <span
              className={`
                mt-4 px-4 py-1.5 rounded-full text-sm font-semibold
                ${
                  student.fees > 0
                    ? "bg-green-500/20 text-green-300 border border-green-500/50"
                    : "bg-red-500/20 text-red-300 border border-red-500/50"
                }
              `}
            >
              {student.fees > 0 ? "Fees Paid" : "Fees Pending"}
            </span>

            {/* USER ID */}
            <div className="
              mt-4 px-4 py-2 rounded-xl bg-white/10 
              border border-white/20 text-gray-300 text-sm shadow-md
            ">
              <span className="font-semibold text-gray-200">User ID:</span>{" "}
              {student.userId}
            </div>

            {/* Go Back */}
            <button
              onClick={() => navigate(-1)}
              className="mt-5 flex items-center gap-2 text-gray-300 hover:text-white"
            >
              <FaArrowLeft /> Back to List
            </button>
          </div>
        </div>

        {/* =============== Right Section Cards =============== */}
        <div className="flex-1 space-y-10">

          <Section
            icon="🎓"
            title="Academic Information"
            data={{
              Institution: student.institutionName,
              Board: student.board,
              Standard: student.standard,
              Group: student.group,
              Language: student.language,
              Fees: `₹ ${student.fees || 0}`,
            }}
          />

          <Section
            icon="🧍"
            title="Personal Information"
            data={{
              "Date of Birth": student.dob?.substring(0, 10),
              Age: student.age,
              Gender: student.gender,
              "Blood Group": student.blood,
              Handicap: student.handicap,
            }}
          />

          <Section
            icon="👨‍👩‍👧"
            title="Parent Information"
            data={{
              Father: student.father,
              "Father Occupation": student.fatherOccupation,
              Mother: student.mother,
              "Mother Occupation": student.motherOccupation,
            }}
          />

          <Section
            icon="📍"
            title="Contact Information"
            data={{
              "Alt Phone": student.altPhone,
              Address: student.address,
              District: student.district,
              State: student.state,
              Pincode: student.pincode,
            }}
          />

        </div>
      </div>
    </div>
  );
}


/* ====================================
   SECTION BLOCK (Card with Title)
==================================== */
function Section({ icon, title, data }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xl font-bold text-cyan-400">{title}</h3>
      </div>

      <div className="
        grid grid-cols-1 sm:grid-cols-2 gap-6 
        bg-white/5 border border-white/10
        rounded-2xl p-6 shadow-lg backdrop-blur-md
      ">
        {Object.entries(data).map(([key, val]) => (
          <div
            key={key}
            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/40 transition shadow-md"
          >
            <p className="text-gray-400 text-xs uppercase mb-1">{key}</p>
            <p className="text-gray-200 font-semibold">
              {val || <span className="text-gray-500">—</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
