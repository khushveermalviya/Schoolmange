import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from "graphql";
import sql from "mssql";

// Define the Staff Type
const StaffType = new GraphQLObjectType({
  name: "Staff",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    department: { type: GraphQLString },
    role: { type: GraphQLString },
    status: { type: GraphQLString },
    joiningDate: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

// Define the Query for fetching all staff data
const GetAllStaff = {
  type: new GraphQLList(StaffType), // List of StaffType
  async resolve() {
    try {
      const result = await sql.query`
        SELECT 
          id, first_name AS firstName, last_name AS lastName, email, phone,
          department, role, status, joining_date AS joiningDate,
          created_at AS createdAt, updated_at AS updatedAt
        FROM Staff
      `;
      return result.recordset; // Return all rows
    } catch (err) {
      throw new Error("Error fetching staff data: " + err.message);
    }
  },
};

export default GetAllStaff;
