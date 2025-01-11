import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLFloat,GraphQLList } from 'graphql';
import sql from 'mssql';

// Define the StudentFees Type
const StudentFeesType = new GraphQLObjectType({
  name: 'StudentFees',
  fields: () => ({
    StudentId: { type: GraphQLString },
    FirstName: { type: GraphQLString },
    FeeStatus: { type: GraphQLString },
    AmountPaid: { type: GraphQLFloat },
    TotalFee: { type: GraphQLFloat }
  })
});

const StudentFees = {
    type: new GraphQLList(StudentFeesType),
    args: {},
    async resolve(parent, args) {
      const result = await sql.query`
        SELECT 
          StudentId, 
          FirstName, 
          FeeStatus, 
          AmountPaid, 
          TotalFee 
        FROM StudentFees 
      `;
      return result.recordset;   
    }
  };
  
  export  {StudentFees};
  