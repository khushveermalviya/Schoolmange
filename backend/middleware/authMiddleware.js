import jwt from 'jsonwebtoken';
// import { SECRET_KEY } from '../Config/secret.js';
import sql from "mssql"
import dotenv from 'dotenv';
dotenv.config();
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const SECRET_KEY = process.env.SECRET_KEY; 
  if (!token) {
      req.student = null; 
      return next();
  }

  try {
      const decoded = jwt.verify(token, SECRET_KEY);

      // Fetch student details (adjust query as needed)
      const result = await sql.query`
          SELECT StudentID, FirstName, LastName, Class
          FROM Students
          WHERE StudentID = ${decoded.StudentID}
      `;

      if (result.recordset.length > 0) {
          req.student = result.recordset[0];
      } else {
          req.student = null; // Or handle the case where the student is not found
      }

  } catch (error) {
      console.error("Token verification failed:", error);
      req.student = null; // Or handle the error (e.g., return 401)
  }
  next();
};

export default authMiddleware;
