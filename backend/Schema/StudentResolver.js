import jwt from 'jsonwebtoken';
import sql from 'mssql';
import StudentLoginType from './StudentLogin.js';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();
// import { SECRET_KEY } from '../Config/secret.js';
const SECRET_KEY = process.env.SECRET_KEY; //not imported
const studentLogin = {
  type: StudentLoginType,
  args: {
    StudentID: { type: new GraphQLNonNull(GraphQLString) },
    Password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    const result = await sql.query`
      SELECT StudentID, Password, FirstName, LastName, Class, WeeklyPerformance
      FROM Students
      WHERE StudentID = ${args.StudentID} AND Password = ${args.Password}
    `;

    const stud = result.recordset[0];
    if (!stud) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { StudentID: stud.StudentID, role: 'student' },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return {
      token,
      StudentID: stud.StudentID,
      FirstName: stud.FirstName,
      LastName: stud.LastName,
      Class: stud.Class,
      WeeklyPerformance: JSON.parse(stud.WeeklyPerformance || '[]'),
    };
  },
};

export default studentLogin;