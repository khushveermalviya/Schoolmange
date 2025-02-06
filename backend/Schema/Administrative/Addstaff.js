import { GraphQLObjectType, GraphQLString, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import sql from 'mssql';

// Define Input Type for Staff
const StaffInputType = new GraphQLInputObjectType({
  name: 'StaffInput',
  fields: () => ({
    first_name: { type: new GraphQLNonNull(GraphQLString) },
    last_name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phone: { type: new GraphQLNonNull(GraphQLString) },
    department: { type: new GraphQLNonNull(GraphQLString) },
    role: { type: new GraphQLNonNull(GraphQLString) },
    joining_date: { type: new GraphQLNonNull(GraphQLString) },
    Username: { type: new GraphQLNonNull(GraphQLString) },
    Password: { type: new GraphQLNonNull(GraphQLString) }
  })
});

// Define Output Type for Staff (matching your database schema)
const StaffTypess = new GraphQLObjectType({
  name: 'Staffss',
  fields: () => ({
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    department: { type: GraphQLString },
    role: { type: GraphQLString },
    joining_date: { type: GraphQLString },
    Username: { type: GraphQLString },
    Password: { type: GraphQLString }
  })
});

// Export the mutation field configuration
export const AddStaff = {
  type: StaffTypess,
  args: {
    input: { type: new GraphQLNonNull(StaffInputType) }
  },
  resolve: async (parent, args) => {
    try {
      const { first_name, last_name, email, phone, department, role, joining_date, Username, Password } = args.input;
      
      // Insert into Staff table without expecting staff_id
      const result = await sql.query`
        INSERT INTO Staff (
          first_name, last_name, email, phone, 
          department, role, joining_date, Username, Password
        )
        OUTPUT 
          INSERTED.first_name, 
          INSERTED.last_name,
          INSERTED.email, 
          INSERTED.phone, 
          INSERTED.department,
          INSERTED.role, 
          INSERTED.joining_date, 
          INSERTED.Username,
          INSERTED.Password
        VALUES (
          ${first_name}, ${last_name}, ${email}, ${phone},
          ${department}, ${role}, ${joining_date}, ${Username}, ${Password}
        )
      `;

      return result.recordset[0];
    } catch (error) {
      console.error('Error adding staff:', error);
      throw new Error('Failed to add staff member');
    }
  }
};