import validateToken from './validateToken.js';

const authMiddleware = (expectedRole) => async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // console.log('Authorization Header:', req.headers.authorization);

  if (!token) {
    req.user = null;
    return next();
  }

  const validationResult = await validateToken(token, expectedRole);

  if (!validationResult.valid) {
    req.user = null;
    req.tokenExpired = validationResult.message === 'Token expired';
    return next();
  }

  req.user = validationResult.user;
  req.tokenExpired = false;
  next();
};

export default authMiddleware;