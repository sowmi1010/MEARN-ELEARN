// middlewares/permission.js
module.exports = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Unauthorized: user missing" });

    // Super Admin or Admin always have full access
    if (req.user.role === "admin" || req.user.isSuperAdmin) {
      return next();
    }

    // Mentor: check if permission exists
    if (
      req.user.role === "mentor" &&
      Array.isArray(req.user.permissions) &&
      req.user.permissions.includes(requiredPermission)
    ) {
      return next();
    }

    // Access denied
    return res.status(403).json({
      message: `Access denied: missing permission (${requiredPermission})`,
    });
  };
};
