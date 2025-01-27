import jwt from 'jsonwebtoken';
import sql from 'mssql';
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

    const result = await sql.query`
      SELECT StudentID, FirstName, LastName, Class
      FROM Students
      WHERE StudentID = ${decoded.StudentID}
    `;

    if (result.recordset.length > 0) {
      req.student = result.recordset[0];
    } else {
      req.student = null;
    }
  } catch (error) {
    req.student = null;
  }
  next();
};

export default authMiddleware;