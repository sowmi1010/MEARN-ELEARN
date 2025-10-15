// ✅ middlewares/role.js
module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Unauthorized: user missing" });

    // ✅ Super Admin always has access
    if (req.user.isSuperAdmin) return next();

    // ✅ If the user's main role matches (e.g., admin → full access)
    if (req.user.role === requiredRole) return next();

    // ✅ NEW: Mentor/other roles with explicit permission access
    const hasPermission =
      Array.isArray(req.user.permissions) &&
      req.user.permissions.includes(requiredRole.toLowerCase());

    if (hasPermission) return next();

    // ❌ Deny if no permission found
    return res
      .status(403)
      .json({ message: `Access denied: Missing "${requiredRole}" permission` });
  };
};
