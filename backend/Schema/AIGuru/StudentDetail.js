import { GraphQLObjectType,GraphQLString ,GraphQLNonNull} from "graphql";
import sql from "mssql"
const StudentDetailType= new GraphQLObjectType({
name:"StudentDetail",
fields:()=>({
    StudentID: { type: GraphQLString },
    FirstName: { type: GraphQLString },
    LastName: { type: GraphQLString },
    Class:{type:GraphQLString},
    Email:{type:GraphQLString},
    FatherName:{type:GraphQLString},
    MotherName:{type:GraphQLString},
    TotalPresent:{type:GraphQLString},
    TotalAbsenet:{type:GraphQLString}
    
}),


});
const StudentDetail = {
    type: StudentDetailType,
    args: {
      StudentID: { type: new GraphQLNonNull(GraphQLString) },
      
    },
    async resolve(parent, args) {
      const result = await sql.query`
           SELECT StudentID, FirstName, LastName, Class, Email, FatherName, MotherName, TotalPresent, TotalAbsent
      FROM Students
        WHERE StudentID = ${args.StudentID}
      `;
      return result.recordset[0];
    },
  };
  
  export default StudentDetail;

