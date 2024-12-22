import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'; // Ensure SECRET_KEY is defined

// General Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from 'Authorization: Bearer <token>'
  if (!token) {
    req.user = null;
    console.log('No token provided');
    return next(); // No token, proceed without user context
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach decoded user info to the request
    console.log('Token decoded:', decoded);
  } catch (error) {
    req.user = null; // Invalid token
    console.log('Invalid token');
  }
  next();
};

// Role-Based Authorization Middleware
const authenticate = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('Unauthorized access attempt');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.user.role !== requiredRole) {
      console.log(`Forbidden access attempt by ${req.user.role}`);
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

export { authMiddleware, authenticate };