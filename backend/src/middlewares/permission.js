module.exports = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: user missing" });
    }

    // Admin always has access
    if (req.user.role === "admin") return next();

    // Mentor must have required permission
    if (req.user.role === "mentor" && req.user.permissions?.includes(requiredPermission)) {
      return next();
    }

    return res.status(403).json({ message: "Access denied: missing permission" });
  };
};
