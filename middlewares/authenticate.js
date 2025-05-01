const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    
    // Standardized user object structure
    req.user = {
      id: decoded.userId || decoded.id, // Handles both formats
      email: decoded.email,
      role: decoded.role
    };

    // Debug log (can be removed in production)
    console.log('Authenticated user:', req.user);
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticate;