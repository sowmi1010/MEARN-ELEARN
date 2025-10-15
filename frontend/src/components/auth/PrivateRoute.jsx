import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, requiredRole, requiredRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 🔒 Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.toLowerCase();

  // ✅ Allow multiple roles if provided
  if (requiredRoles && Array.isArray(requiredRoles)) {
    const allowed = requiredRoles.map((r) => r.toLowerCase());
    if (!allowed.includes(role)) {
      return <Navigate to="/login" replace />;
    }
  }

  // 🔑 Admin area → allow both admin and mentor
  if (requiredRole === "admin" && !["admin", "mentor"].includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // 🔑 Mentor area
  if (requiredRole === "mentor" && role !== "mentor") {
    return <Navigate to="/login" replace />;
  }

  // 🔑 Student area → allow both student and user
  if (requiredRole === "student" && !["student", "user"].includes(role)) {
    if (["admin", "mentor"].includes(role)) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // ✅ Everything OK → render the page
  return children;
}
