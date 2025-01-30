import { GraphQLObjectType,GraphQLString ,GraphQLNonNull} from "graphql";
import sql from "mssql"
const StudentDetailType= new GraphQLObjectType({
name:"StudentDetail",
fields:()=>({
    StudentID: { type: GraphQLString },
    FirstName: { type: GraphQLString },
    Password: { type: GraphQLString },
    LastName: { type: GraphQLString },
    Class:{type:GraphQLString},
    Email:{type:GraphQLString},
    FatherName:{type:GraphQLString},
    MotherName:{type:GraphQLString},
    dob: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    parentPhoneNumber: { type: GraphQLString },
    address: { type: GraphQLString },
    gender: { type: GraphQLString },
    caste: { type: GraphQLString },
    SchoolName: { type: GraphQLString },
    previousClass: { type: GraphQLString }
    
}),


});
const StudentDetail = {
    type: StudentDetailType,
    args: {
      StudentID: { type: new GraphQLNonNull(GraphQLString) },
      
    },
    async resolve(parent, args) {
      const result = await sql.query`
           SELECT StudentID, FirstName, LastName, Password,Class, Email, FatherName, MotherName, dob, phoneNumber,address,gender,caste,SchoolName,previousClass
      FROM Students
        WHERE StudentID = ${args.StudentID}
      `;
      return result.recordset[0];
    },
  };
  
  export default StudentDetail;

