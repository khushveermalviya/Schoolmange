import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../Config/secret.js';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    req.user = null;
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
