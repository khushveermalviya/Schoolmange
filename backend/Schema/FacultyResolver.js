import jwt from 'jsonwebtoken';
import sql from 'mssql';
import FacultyLoginType from './FacultyLogin.js';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { SECRET_KEY } from '../Config/secret.js';

const FacultyLogin = {
  type: FacultyLoginType,
  args: {
    Username: { type: new GraphQLNonNull(GraphQLString) },
    Password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    const result = await sql.query`
      SELECT Username, Password
      FROM Faculty
      WHERE Username = ${args.Username} AND Password = ${args.Password}
    `;

    const faculty = result.recordset[0];
    if (!faculty) throw new Error('Invalid credentials');

    const tokenss = jwt.sign(
      { Username: faculty.Username, role: 'faculty' },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return {
      tokenss,
      Username: faculty.Username,
    };
  },
};

export default FacultyLogin;