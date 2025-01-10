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
    let query = 'SELECT * FROM Students';
    if (Class !== 'all') {
      query += ` WHERE class = ${Class}`;
    }
    
    const result = await sql.query(query);
    if(result.recordset.length ==0){
        throw new Error(`No data found for class: ${Class}`);
    }
    return result.recordset;
  },
};

export { Studentdata };