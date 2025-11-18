module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Unauthorized: user missing" });

    // Super Admin always has access
    if (req.user.isSuperAdmin) return next();

    /* -------------------------------------------------
       SPECIAL CASE:
       Allow student dashboard access to:
       ✔ student
       ✔ user
       ✔ admin (already supported below)
    --------------------------------------------------- */
    if (requiredRole === "student") {
      if (req.user.role === "student") return next();
      if (req.user.role === "user") return next();   // <-- ADDED
      if (req.user.role === "admin") return next();  // already existed
    }

    // Default: role must match exactly
    if (req.user.role === requiredRole) return next();

    // Check permission array (for mentors/teachers)
    const hasPermission =
      Array.isArray(req.user.permissions) &&
      req.user.permissions.includes(requiredRole.toLowerCase());

    if (hasPermission) return next();

    return res
      .status(403)
      .json({ message: `Access denied: Missing "${requiredRole}" permission` });
  };
};
