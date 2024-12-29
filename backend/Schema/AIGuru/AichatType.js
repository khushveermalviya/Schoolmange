// AichatType.js
import { GraphQLObjectType, GraphQLString } from 'graphql';

const AichatType = new GraphQLObjectType({
  name: 'Aichat',
  fields: () => ({
    chat_id: { type: GraphQLString },
    StudentID: { type: GraphQLString },
    user_type: { type: GraphQLString },
    prompt: { type: GraphQLString },
    response: { type: GraphQLString },
    created_at: { type: GraphQLString },
  }),
});

export default AichatType;