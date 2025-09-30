// src/components/auth/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 🔒 Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 🔑 If route requires "admin"
  if (requiredRole === "admin") {
    // ✅ Allow both admin and mentor to enter admin area
    if (!["admin", "mentor"].includes(user.role)) {
      return <Navigate to="/login" replace />;
    }
  }

  // 🔑 If route requires "mentor" only
  if (requiredRole === "mentor" && user.role !== "mentor") {
    return <Navigate to="/login" replace />;
  }

  // 🔑 If route requires "student" only
  if (requiredRole === "student" && user.role !== "student") {
    // Redirect admins & mentors to their dashboards
    if (["admin", "mentor"].includes(user.role)) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
