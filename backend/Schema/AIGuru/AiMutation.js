// AiMutation.js
import { GraphQLNonNull, GraphQLString, GraphQLObjectType } from 'graphql';
import AichatType from './AichatType.js'; // Ensure this path is correct
import sql from 'mssql';

const AiMutation = new GraphQLObjectType({
  name: 'AiMutation',
  fields: {
    addChat: {
      type: AichatType,
      args: {
        StudentID: { type: new GraphQLNonNull(GraphQLString) },
        user_type: { type: new GraphQLNonNull(GraphQLString) },
        prompt: { type: new GraphQLNonNull(GraphQLString) },
        response: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return sql.query`
          INSERT INTO StudentChat (StudentID, user_type, prompt, response)
          VALUES (${args.StudentID}, ${args.user_type}, ${args.prompt}, ${args.response})
          SELECT SCOPE_IDENTITY() AS chat_id
        `
          .then(result => ({
            chat_id: result.recordset[0].chat_id,
            StudentID: args.StudentID,
            user_type: args.user_type,
            prompt: args.prompt,
            response: args.response,
            created_at: new Date().toISOString(),
          }))
          .catch(err => {
            console.error('Error adding chat', err);
            throw new Error('Error adding chat');
          });
      },
    },
  },
});

export default AiMutation;