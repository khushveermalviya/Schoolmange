import sql from 'mssql';
import { GraphQLNonNull, GraphQLString, GraphQLList, GraphQLObjectType } from 'graphql';

const ComplaintType = new GraphQLObjectType({
  name: "Complaint",
  fields: () => ({
    StudentID: { type: GraphQLString },
    Complaint: { type: GraphQLString },
    Class: { type: GraphQLString },
  })
});

const StudentComplaint = {
  type: new GraphQLList(ComplaintType),
  args: {
    Studentid: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, { Studentid }) => {
    const result = await sql.query`
      SELECT * FROM Complaints WHERE Studentid = ${Studentid}
    `;
    return result.recordset;
  }
};
    
export { StudentComplaint };