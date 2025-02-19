import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLID } from "graphql";
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

// Define the Query for fetching a single staff member by ID
const GetStaffById = {
  type: StaffType, // Single StaffType
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) }, // ID argument
  },
  async resolve(parent, args) {
    try {
      const result = await sql.query`
        SELECT 
          id, first_name AS firstName, last_name AS lastName, email, phone,
          department, role, status, joining_date AS joiningDate,
          created_at AS createdAt, updated_at AS updatedAt
        FROM Staff
        WHERE id = ${args.id}
      `;
      if (result.recordset.length === 0) {
        throw new Error("Staff not found");
      }
      return result.recordset[0]; // Return the first row (single staff member)
    } catch (err) {
      throw new Error("Error fetching staff by ID: " + err.message);
    }
  },
};

export { GetAllStaff, GetStaffById }; // Export both queries