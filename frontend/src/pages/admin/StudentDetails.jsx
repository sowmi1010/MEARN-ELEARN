import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function StudentDetails() {
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
      console.error("❌ Fetch student error:", err.response?.data || err.message);
    }
  }

  if (!student) {
    return <p className="text-center text-gray-400 mt-20">Loading student details...</p>;
  }

  return (
    <div className="p-8 min-h-screen bg-darkBg text-gray-200">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-accent tracking-wide">
          🎓 Student Details
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-white shadow"
        >
          ← Back
        </button>
      </div>

      {/* ===== Profile Card ===== */}
      <div className="flex flex-col sm:flex-row gap-8 bg-darkCard/80 p-6 rounded-2xl shadow-xl border border-gray-700">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-accent shadow-lg">
            {student.photo ? (
              <img
                src={`${API_URL}${student.photo}`}
                alt="student"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                No Photo
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-white">
            {student.firstName} {student.lastName}
          </h2>
          <p className="text-gray-400">{student.email}</p>
          <p className="text-gray-400">📞 {student.phone}</p>
        </div>
      </div>

      {/* ===== Details Grid ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        <Detail label="DOB" value={student.dob?.substring(0, 10)} />
        <Detail label="Age" value={student.age} />
        <Detail label="Gender" value={student.gender} />
        <Detail label="Blood Group" value={student.blood} />
        <Detail label="Handicap" value={student.handicap} />
        <Detail label="Institution" value={student.institutionName} />
        <Detail label="Standard" value={student.standard} />
        <Detail label="Group" value={student.group} />
        <Detail label="Board" value={student.board} />
        <Detail label="Type" value={student.type} />
        <Detail label="Language" value={student.language} />
        <Detail label="Fees" value={student.fees} />
        <Detail label="Father" value={student.father} />
        <Detail label="Father Occupation" value={student.fatherOccupation} />
        <Detail label="Mother" value={student.mother} />
        <Detail label="Mother Occupation" value={student.motherOccupation} />
        <Detail label="Alt Phone" value={student.altPhone} />
        <Detail label="Address" value={student.address} />
        <Detail label="District" value={student.district} />
        <Detail label="State" value={student.state} />
        <Detail label="Pincode" value={student.pincode} />
        <Detail label="User ID" value={student.userId} />
      </div>

      {/* ===== Actions ===== */}
      <div className="flex justify-end mt-8">
        <Link
          to={`/admin/students/edit/${student._id}`}
          className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow hover:scale-105 transition"
        >
          ✏️ Edit
        </Link>
      </div>
    </div>
  );
}

// ✅ Reusable info card
function Detail({ label, value }) {
  return (
    <div className="bg-darkCard p-4 rounded-xl border border-gray-700 hover:border-accent/60 shadow transition">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-white font-semibold mt-1">{value || "—"}</p>
    </div>
  );
}
