import { GraphQLObjectType, GraphQLString, GraphQLInt ,GraphQLList} from "graphql";
import sql from "mssql";
const StudentDataTypes = new GraphQLObjectType({
    name:"studentdata",
    fields: () => ({
        StudentID: { type: GraphQLString },
        FirstName: { type: GraphQLString },
        LastName: { type: GraphQLString },
       Class:{type:GraphQLString},  
         Email: { type: GraphQLString },
       FatherName: { type: GraphQLString },
       MotherName: { type: GraphQLString },
       TotalPresent: { type: GraphQLString },
       TotalAbsent: { type: GraphQLString }
   
       
      }),
})


const AttendanceType = new GraphQLObjectType({
  name: "Attendance",
  fields: () => ({
    AttendanceID: { type: GraphQLInt },
    StudentID: { type: GraphQLString },
    Username: { type: GraphQLString },
    Date: { type: GraphQLString },
    Status: { type: GraphQLString },
    Remarks: { type: GraphQLString },
    // Nested student details
    student: {
      type: StudentDataTypes,
      async resolve(parent) {
        const result = await sql.query`
          SELECT StudentID, FirstName, LastName, Class, Email, 
                 FatherName, MotherName, TotalPresent, TotalAbsent
          FROM Students 
          WHERE StudentID = ${parent.StudentID}
        `;
        return result.recordset[0];
      }
    }
  })
});

export default AttendanceType;