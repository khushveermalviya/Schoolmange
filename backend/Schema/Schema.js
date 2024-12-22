import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLNonNull } from 'graphql';
import jwt from 'jsonwebtoken';
import sql from 'mssql';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

const SECRET_KEY = process.env.SECRET_KEY || generateSecretKey(); // Ensure SECRET_KEY is defined

// Student Login Type
const StudentLoginType = new GraphQLObjectType({
  name: 'StudentLogin',
  fields: () => ({
    StudentID: { type: GraphQLString },
    FirstName: { type: GraphQLString },
    LastName: { type: GraphQLString },
    token: { type: GraphQLString }
  })
});

// Faculty Login Type
const FacultyLoginType = new GraphQLObjectType({
  name: 'FacultyLogin',
  fields: () => ({
    Username: { type: GraphQLString },
    token: { type: GraphQLString }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    studentLogin: {
      type: StudentLoginType,
      args: {
        StudentID: { type: new GraphQLNonNull(GraphQLString) },
        Password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return sql.query`SELECT StudentID, Password, FirstName, LastName FROM Students WHERE StudentID = ${args.StudentID} AND Password = ${args.Password}`
          .then(async result => {
            const stud = result.recordset[0];
            if (!stud) {
              throw new Error("Invalid credentials");
            }
            const token = jwt.sign({ StudentID: stud.StudentID }, SECRET_KEY, { expiresIn: '1h' });
            console.log("Generated Token:", token);
            return {
              token,
              StudentID: stud.StudentID,
              FirstName: stud.FirstName,
              LastName: stud.LastName,
              WeeklyPerformance: stud.WeeklyPerformance,
              Attendance: stud.Attendance
            };
          });
      }
    },
    FacultyLogin: {
      type: FacultyLoginType,
      args: {
        Username: { type: new GraphQLNonNull(GraphQLString) },
        Password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return sql.query`SELECT Username, Password FROM Faculty WHERE Username = ${args.Username} AND Password = ${args.Password}`
          .then(async result => {
            const faculty = result.recordset[0];
            if (!faculty) {
              throw new Error("Invalid credentials");
            }
            const token = jwt.sign({ Username: faculty.Username }, SECRET_KEY, { expiresIn: '1h' });
            console.log("Generated Token:", token);
            return {
              token,
              Username: faculty.Username
            };
          });
      }
    },
    getStudentData: {
      type: StudentLoginType,
      resolve(parent, args, context) {
        if (!context.user) {
          throw new Error("Unauthorized"); // Ensure user is authenticated
        }
        return sql.query`SELECT * FROM Students WHERE StudentID = ${context.user.id}`
          .then(result => result.recordset[0]);
      }
    }
  }
});

export default new GraphQLSchema({
  query: RootQuery
});