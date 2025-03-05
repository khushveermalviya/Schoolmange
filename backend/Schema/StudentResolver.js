import jwt from 'jsonwebtoken';
import sql from 'mssql';
import StudentLoginType from './StudentLogin.js';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const studentLogin = {
  type: StudentLoginType,
  args: {
    StudentID: { type: new GraphQLNonNull(GraphQLString) },
    Password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    const result = await sql.query`
      SELECT StudentID, Password, FirstName, LastName, Class, FatherName, SchoolName, WeeklyPerformance
      FROM Students
      WHERE StudentID = ${args.StudentID} AND Password = ${args.Password}
    `;

    const stud = result.recordset[0];
    if (!stud) throw new Error('Invalid credentials');
    
    const token = jwt.sign( 
      { StudentID: stud.StudentID, role: 'student' },
      SECRET_KEY,
      { expiresIn: '1h' } // Changed from '1h' to '1m' for 1-minute expiration
    );
    
    return {
      token,
      StudentID: stud.StudentID,
      FirstName: stud.FirstName,
      LastName: stud.LastName,
      Class: stud.Class,
      FatherName: stud.FatherName,
      SchoolName: stud.SchoolName,
      WeeklyPerformance: JSON.parse(stud.WeeklyPerformance || '[]'),
    };
  },
};

export default studentLogin;