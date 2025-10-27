// middlewares/permission.js
module.exports = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: user missing" });
    }

    const { role, isSuperAdmin, permissions = [] } = req.user;

    if (isSuperAdmin || role === "admin") return next();

    // Normalize to lowercase for safe comparison
    const normalizedPerms = permissions.map((p) => p.toLowerCase());
    const defaultAccess = ["dashboard", "home"];
    const allowed = [...new Set([...defaultAccess, ...normalizedPerms])];

    if (role === "mentor") {
      if (allowed.includes(requiredPermission.toLowerCase())) return next();
      return res
        .status(403)
        .json({ message: `Mentor access denied (${requiredPermission})` });
    }

    if (role === "student") {
      const studentAllowed = ["home", "courses", "dashboard"];
      if (studentAllowed.includes(requiredPermission.toLowerCase()))
        return next();
      return res
        .status(403)
        .json({ message: `Student access denied (${requiredPermission})` });
    }

    return res
      .status(403)
      .json({ message: `Access denied: missing (${requiredPermission})` });
  };
};
