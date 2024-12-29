// AichatResolver.js
import { GraphQLString } from 'graphql';
import AichatType from './AichatType.js';
import sql from 'mssql';

const Aichat = {
  type: AichatType,
  args: { StudentID: { type: GraphQLString } },
  resolve(parent, args) {
    return sql.query`SELECT * FROM StudentChat WHERE StudentID = ${args.StudentID}`
      .then(result => result.recordset);
  },
};

export default Aichat;