import jwt from 'jsonwebtoken';
import sql from 'mssql';
import StudentDataType from './StudentData.js';
import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { SECRET_KEY } from '../Config/secret.js';

const Studentdata = {
  type: new GraphQLList(StudentDataType),
  args: {
    Class: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, { Class }) => {
    try {
      // Use parameterized queries to prevent SQL injection
      let query = 'SELECT * FROM Students';
      const request = new sql.Request();

      if (Class !== 'all') {
        query += ' WHERE class = @class';
        request.input('class', sql.NVarChar, Class); // Add parameter for class
      }

      // Execute the query
      const result = await request.query(query);

      // Return the recordset (empty array if no data is found)
      return result.recordset;
    } catch (error) {
      console.error('Error fetching student data:', error);
      throw new Error('An error occurred while fetching student data.');
    }
  },
};

export { Studentdata };