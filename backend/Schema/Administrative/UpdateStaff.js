import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import sql from "mssql";
const StaffTypes = new GraphQLObjectType({
    name: "Staffsss",
    fields: () => ({

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
  
// Update Staff Mutation


// Query for fetching staff by Username
const GetStaffByUsername = {
  type: StaffTypes, // Your existing StaffTypes
  args: {
    Username: { type: new GraphQLNonNull(GraphQLString) }
  },
  async resolve(parent, args) {
    try {
      const request = new sql.Request();
      
      const query = `
        SELECT 
          Username,
          first_name AS firstName,
          last_name AS lastName,
          email,
          phone,
          department,
          role,
          status,
          joining_date AS joiningDate,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM Staff
        WHERE Username = @Username
      `;
      
      request.input('Username', sql.NVarChar, args.Username);
      
      const result = await request.query(query);
      
      if (result.recordset.length === 0) {
        throw new Error("Staff member not found");
      }
      
      return result.recordset[0];
    } catch (err) {
      console.error("Error fetching staff by username:", err);
      throw new Error(`Error fetching staff details: ${err.message}`);
    }
  }
};

// Update Staff Mutation (as you provided)
const UpdateStaff = {
  type: StaffTypes,
  args: {
    Username: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    department: { type: GraphQLString },
    role: { type: GraphQLString },
    status: { type: GraphQLString }
  },
  async resolve(parent, args) {
    try {
      const request = new sql.Request();

      // Construct dynamic update query
      let updateQuery = `UPDATE Staff SET`;
      const updateFields = [];

      // Add each field to update if provided
      if (args.firstName) {
        updateFields.push(`first_name = @firstName`);
        request.input('firstName', sql.NVarChar, args.firstName);
      }
      if (args.lastName) {
        updateFields.push(`last_name = @lastName`);
        request.input('lastName', sql.NVarChar, args.lastName);
      }
      if (args.email) {
        updateFields.push(`email = @email`);
        request.input('email', sql.NVarChar, args.email);
      }
      if (args.phone) {
        updateFields.push(`phone = @phone`);
        request.input('phone', sql.NVarChar, args.phone);
      }
      if (args.department) {
        updateFields.push(`department = @department`);
        request.input('department', sql.NVarChar, args.department);
      }
      if (args.role) {
        updateFields.push(`role = @role`);
        request.input('role', sql.NVarChar, args.role);
      }
      if (args.status) {
        updateFields.push(`status = @status`);
        request.input('status', sql.NVarChar, args.status);
      }

      // Add updated timestamp
      updateFields.push(`updated_at = GETDATE()`);

      // Add condition for specific staff member
      updateQuery += ` ${updateFields.join(', ')} WHERE Username = @Username`;
      request.input('Username', sql.NVarChar, args.Username);

      // Execute update
      await request.query(updateQuery);

      // Fetch and return updated staff member
      const fetchQuery = `
        SELECT 
          Username,
          first_name AS firstName,
          last_name AS lastName,
          email,
          phone,
          department,
          role,
          status,
          joining_date AS joiningDate,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM Staff 
        WHERE Username = @Username
      `;

      const fetchResult = await request.query(fetchQuery);
      return fetchResult.recordset[0];

    } catch (err) {
      console.error("Error updating staff:", err);
      throw new Error(`Error updating staff details: ${err.message}`);
    }
  }
};

export { GetStaffByUsername, UpdateStaff };
