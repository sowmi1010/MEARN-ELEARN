import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedAdmin() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.toLowerCase();

  if (!["admin", "mentor"].includes(role)) {
    return <Navigate to="/student" replace />;
  }

  return <Outlet />;
}
