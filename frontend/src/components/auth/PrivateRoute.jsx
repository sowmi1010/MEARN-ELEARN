import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, requiredRole, requiredRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ✅ 1. Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.toLowerCase();

  // ✅ 2. Super admin/admin always allowed everywhere
  if (user.isSuperAdmin || role === "admin") {
    return children;
  }

  // ✅ 3. Allow multiple roles if requiredRoles prop is used
  if (requiredRoles && Array.isArray(requiredRoles)) {
    const allowed = requiredRoles.map((r) => r.toLowerCase());
    if (!allowed.includes(role)) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  // ✅ 4. Admin area → allow both admin + mentor
  if (requiredRole === "admin") {
    if (["admin", "mentor"].includes(role)) {
      return children;
    }
    return <Navigate to="/login" replace />;
  }

  // ✅ 5. Mentor area → strictly mentor only
  if (requiredRole === "mentor" && role !== "mentor") {
    return <Navigate to="/login" replace />;
  }

  // ✅ 6. Student area → allow student + user
  if (requiredRole === "student") {
    if (["student", "user"].includes(role)) {
      return children;
    }
    // redirect mentors/admins to their dashboards instead of logout
    if (["admin", "mentor"].includes(role)) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // ✅ 7. Default: just return children if all okay
  return children;
}
