import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from 'Authorization: Bearer <token>'
  if (!token) {
    req.user = null;
    return next(); // No token, proceed without user context
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach decoded user info to the request
  } catch (error) {
    req.user = null; // Invalid token
  }
  next();
};
export default authMiddleware;
