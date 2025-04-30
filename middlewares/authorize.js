// This is a middleware factory that returns a middleware function
const authorize = (requiredRole) => {
  return (req, res, next) => {
    if (req.user?.role !== requiredRole) {
      return res.status(403).json({ error: `Access forbidden. ${requiredRole} role required` });
    }
    next();
  };
};

module.exports = authorize; // Export the factory function directly