import { GraphQLSchema, GraphQLObjectType,GraphQLList,GraphQLString } from 'graphql';
import sql from "mssql"
import studentLogin from './StudentResolver.js';
import facultyLogin from './FacultyResolver.js';
const ChatType = new GraphQLObjectType({
  name: 'Chat',
  fields: () => ({
    chat_id: { type: GraphQLString },
    StudentID: { type: GraphQLString },
    user_type: { type: GraphQLString },
    prompt: { type: GraphQLString },
    response: { type: GraphQLString },
    created_at: { type: GraphQLString },
  }),
});
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    studentLogin,
    facultyLogin,
    getStudentChats: {
      type: new GraphQLList(ChatType),
      args: { StudentID: { type: GraphQLString } },
      resolve(parent, args) {
        return sql.query`SELECT * FROM StudentChat WHERE StudentID = ${args.StudentID}`
          .then(result => result.recordset);
      },
    },
  },
});
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addChat: {
      type: ChatType,
      args: {
        StudentID: { type: GraphQLString },
        user_type: { type: GraphQLString },
        prompt: { type: GraphQLString },
        response: { type: GraphQLString },
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
export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
