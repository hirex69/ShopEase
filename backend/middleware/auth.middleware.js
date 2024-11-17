const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assuming you're using a User model to fetch user details

 // Assuming you have a User model
 const protect = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Extract the token
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token

    const user = await User.findById(decoded.id);  // Get the user from the decoded ID

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;  // Attach the user to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};




// isAdmin middleware: Checks if the user has an admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {  // Check if the user's role is admin
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
  
  next();  // Proceed to the next route handler
  // In the backend middleware (auth.middleware.js)

// In the frontend

};

module.exports = { protect, isAdmin };
