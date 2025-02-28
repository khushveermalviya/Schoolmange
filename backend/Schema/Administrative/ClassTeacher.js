import {GraphQLObjectType,GraphQLInt,GraphQLString,GraphQLList, GraphQLInputObjectType,GraphQLNonNull} from "graphql"

import sql from  "mssql"
 
const ClassTeacherType = new GraphQLObjectType({
    name: "ClassTeacher",
    fields: () => ({
      first_name: { type: GraphQLString },
      last_name: { type: GraphQLString },
      role: { type: GraphQLString },
      Class: { type: GraphQLInt }
    })
  });
  
  const ClassTeacherQuery = {
    type: new GraphQLList(ClassTeacherType),
    async resolve(parent) {
      try {
        const result = await sql.query`
          SELECT first_name, last_name, role, Class FROM Staff
        `;
        return result.recordset;
      } catch (err) {
        throw new Error("Error fetching staff data: " + err.message);
      }
    }
  };
  const ClassInputType = new GraphQLInputObjectType({
    name: "ClassInputd",
    fields: {
      Class: { type: GraphQLInt },
      first_name: { type: GraphQLString }
    }
  });
  
  const ClassMutation = {
    type: ClassTeacherType,
    args: {
      
      input: { type: new GraphQLNonNull(ClassInputType) }
    },
    async resolve(parent, { input }, context) {
      try {
        const connection = await sql.connect(context.sqlConfig);
  
        const result = await connection.request()
          .input('first_name', sql.NVarChar, input.first_name)
          .input('Class', sql.Int, input.Class)
          .query`
            UPDATE Staff
            SET Class = @Class
            WHERE first_name = @first_name
          `;
  
        if (!result.rowsAffected[0]) {
          throw new Error('Failed to update class in staff record');
        }
  
        // Fetch the updated record to return
        const updatedRecord = await connection.request()
          .input('first_name', sql.NVarChar, input.first_name)
          .query`
            SELECT first_name, last_name, role, Class
            FROM Staff
            WHERE first_name = @first_name
          `;
  
        return updatedRecord.recordset[0];
      } catch (error) {
        throw new Error(error.message || 'Failed to update class in staff record');
      }
    }
  };
export {ClassTeacherQuery,ClassMutation}
    


