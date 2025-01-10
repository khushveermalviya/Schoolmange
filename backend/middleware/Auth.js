import jwt from "jsonwebtoken"
const SECRET_KEY = process.env.SECRET_KEY; // Ensure SECRET_KEY is securely managed

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    req.user = null;
    console.log('No token provided');
    return next();
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
  } catch (error) {
    req.user = null;

  }
  next();
};

export default authMiddleware;
