import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
  };
export const SECRET_KEY = process.env.SECRET_KEY || generateSecretKey();;

