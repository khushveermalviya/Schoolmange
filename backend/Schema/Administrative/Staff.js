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
    Class: { type: GraphQLString },
    Username: { type: GraphQLString } // Add Username to the type
  }),
});

// Define the Query for fetching all staff data
const GetAllStaff = {
  type: new GraphQLList(StaffType),
  async resolve() {
    try {
      const result = await sql.query`
        SELECT
          id, 
          first_name AS firstName, 
          last_name AS lastName, 
          email, 
          phone,
          department, 
          role, 
          status, 
          joining_date AS joiningDate,
          created_at AS createdAt, 
          updated_at AS updatedAt,
          Class,
          Username
        FROM Staff
      `;
      return result.recordset;
    } catch (err) {
      throw new Error("Error fetching staff data: " + err.message);
    }
  },
};

// Define the Query for fetching a single staff member
const GetStaffById = {
  type: StaffType,
  args: {
    id: { type: GraphQLID },
    Username: { type: GraphQLString }
  },
  async resolve(parent, args) {
    try {
      // Check if either id or Username is provided
      if (!args.id && !args.Username) {
        throw new Error("Either ID or Username must be provided");
      }

      // Create a request object instead of using template literals
      const request = new sql.Request();

      // Construct dynamic query
      let query = `
        SELECT
          id, 
          first_name AS firstName, 
          last_name AS lastName, 
          email, 
          phone,
          department, 
          role, 
          status, 
          joining_date AS joiningDate,
          created_at AS createdAt, 
          updated_at AS updatedAt,
          Class,
          Username
        FROM Staff
        WHERE 1=1
      `;

      // Add ID condition if provided
      if (args.id) {
        query += ` AND id = @id`;
        request.input('id', sql.Int, args.id);
      }

      // Add Username condition if provided
      if (args.Username) {
        query += ` AND Username = @Username`;
        request.input('Username', sql.NVarChar, args.Username);
      }

      // Execute the query with parameters
      const result = await request.query(query);

      // Check if staff member found
      if (result.recordset.length === 0) {
        throw new Error("Staff not found");
      }

      // Return the first matching record
      return result.recordset[0];
    } catch (err) {
      console.error("Error in GetStaffDetails resolver:", err);
      throw new Error(`Error fetching staff details: ${err.message}`);
    }
  },
};
export { 
  GetAllStaff, 
  GetStaffById // Renamed from GetStaffById to reflect broader functionality
};