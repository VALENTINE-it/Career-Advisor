const jwt = require("jsonwebtoken");
require("dotenv").config();

// Verifies the Authorization: Bearer <token> header and attaches the
// decoded user (id, name, role) to req.user.
function verifyToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Restricts a route to one or more roles, e.g. requireRole("teacher")
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Not authorized for this resource" });
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };
