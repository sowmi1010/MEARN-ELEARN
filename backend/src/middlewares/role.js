// middlewares/role.js
module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: user missing" });
    }

    // ✅ Super Admin always has access
    if (req.user.isSuperAdmin) return next();

    // ✅ Check role match
    if (req.user.role === requiredRole) return next();

    return res.status(403).json({ message: "Access denied" });
  };
};
