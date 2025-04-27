const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;  // Attach decoded user info to request
    next();  // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticate;
