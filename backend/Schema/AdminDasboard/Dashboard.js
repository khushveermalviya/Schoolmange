import sql from "mssql";
import { GraphQLObjectType, GraphQLInt, GraphQLSchema, GraphQLNonNull } from "graphql";

// Define the Dashboard type
const Dashtype = new GraphQLObjectType({
  name: "Dashboard",
  fields: () => ({
    StudentCount: { type: GraphQLInt },
    Faculty: { type: GraphQLInt },
    Department: { type: GraphQLInt }
  })
});

// Define the Dashboard query
const DashBoard = {
  type: Dashtype,
  args: {},
  resolve: async (parent, args) => {
    // Fetch the total number of students from the database
    const result = await sql.query`
      SELECT COUNT(*) AS total_students FROM Students;
    `;
    // Return the result in the expected format
    return {
      StudentCount: result.recordset[0].total_students,
      Faculty: 0, // Placeholder value, replace with actual query if needed
      Department: 0 // Placeholder value, replace with actual query if needed
    };
  }
};

// Export the Dashboard query
export { DashBoard };