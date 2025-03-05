import jwt from 'jsonwebtoken';
import sql from 'mssql';

const SECRET_KEY = process.env.SECRET_KEY;

// Reusable function to validate tokens
async function validateToken(token) {
  if (!token) return { valid: false, message: 'No token provided' };

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, SECRET_KEY);
    // console.log('Decoded token:', decoded);

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return { valid: false, message: 'Token expired' };
    }

    // Query the database to check if the user exists
    let result;
    if (decoded.role === 'student') {
      result = await sql.query`
        SELECT StudentID, FirstName, LastName, Class
        FROM Students
        WHERE StudentID = ${decoded.StudentID}
      `;
    } else if (decoded.role === 'faculty') {
      result = await sql.query`
        SELECT Username
        FROM Staff
        WHERE Username = ${decoded.Username}
      `;
    }

    if (result.recordset.length > 0) {
      return { valid: true, message: 'Token is valid', role: decoded.role, user: result.recordset[0] };
    } else {
      return { valid: false, message: 'User not found in database' };
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    if (error.name === 'TokenExpiredError') {
      return { valid: false, message: 'Token expired' };
    }
    return { valid: false, message: 'Invalid token' };
  }
}

export default validateToken;