const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    
    // Map the token fields to req.user
    req.user = {
      id: decoded.userId,  // Important: Use decoded.userId here
      email: decoded.email,
      role: decoded.role
    };
    
    // Debug log (you can remove later)
    console.log('Authenticated user:', req.user);
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticate