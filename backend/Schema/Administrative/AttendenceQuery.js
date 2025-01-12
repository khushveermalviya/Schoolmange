import { GraphQLNonNull, GraphQLString, GraphQLList } from "graphql";
import sql from "mssql";
import AttendanceType from "./Attendence.js";

const GetStudentAttendance = {
  type: new GraphQLList(AttendanceType),
  args: {
    StudentID: { type: new GraphQLNonNull(GraphQLString) },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString }
  },
  async resolve(parent, args) {
    if (args.startDate && args.endDate) {
      const result = await sql.query`
        SELECT * FROM Attendance 
        WHERE StudentID = ${args.StudentID}
        AND Date BETWEEN ${args.startDate} AND ${args.endDate}
        ORDER BY Date DESC
      `;
      return result.recordset;
    } else {
      const result = await sql.query`
        SELECT * FROM Attendance 
        WHERE StudentID = ${args.StudentID}
        ORDER BY Date DESC
      `;
      return result.recordset;
    }
  }
};

const GetFacultyAttendance = {
  type: new GraphQLList(AttendanceType),
  args: {
    Username: { type: new GraphQLNonNull(GraphQLString) },
    Date: { type: GraphQLString }
  },
  async resolve(parent, args) {
    if (args.Date) {
      const result = await sql.query`
        SELECT * FROM Attendance 
        WHERE Username = ${args.Username}
        AND Date = ${args.Date}
        ORDER BY StudentID
      `;
      return result.recordset;
    } else {
      const result = await sql.query`
        SELECT * FROM Attendance 
        WHERE Username = ${args.Username}
        ORDER BY Date DESC, StudentID
      `;
      return result.recordset;
    }
  }
};

export { GetStudentAttendance, GetFacultyAttendance };