import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedStudent() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ❌ DO NOT RETURN BEFORE HOOKS — SAFE TO RETURN HERE (no hooks exist)
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.toLowerCase();

  // Allow only student/user, block admin/mentor
  if (!["student", "user"].includes(role)) {
    return <Navigate to="/admin/home" replace />;
  }

  return <Outlet />;
}
