const authorize = (requiredRole) => {
    return (req, res, next) => {
      // Ensure the user is authenticated and their role matches the required one
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ error: "You do not have permission to access this resource" });
      }
      next();  // Proceed to the next middleware/route handler
    };
  };
  
  module.exports = authorize;
  